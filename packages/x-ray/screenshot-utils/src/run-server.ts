import path from 'path'
import http from 'http'
import url from 'url'
import makeDir from 'make-dir'
import { TarFs } from '@x-ray/tar-fs'
import { isString, isUndefined, objectHas, isDefined } from 'tsfn'
import pAll from 'p-all'
import pkgDir from 'pkg-dir'
import { TScreenshotsResultData, TScreenshotsResult, TScreenshotResultType, TScreenshotsSave, TScreenshotItems } from './types'

const SAVE_FILES_CONCURRENCY = 4
const PACKAGE_DIR_CONCURRENCY = 4

export type TRunServer = {
  platform: string,
  result: TScreenshotsResult,
  resultData: TScreenshotsResultData,
}

export const runServer = ({ platform, result, resultData }: TRunServer) => new Promise((resolve, reject) => {
  const pathMap = new Map<string, string>()

  const server = http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

        if (req.method === 'GET') {
          if (req.url === '/list') {
            const shortPaths = await pAll(Object.keys(result).map((longPath) => async () => {
              const packageDir = await pkgDir(path.dirname(longPath))

              if (isUndefined(packageDir)) {
                throw new Error(`Cannot find package dir for "${longPath}"`)
              }

              const shortPath = path.relative(path.resolve('packages/'), packageDir)

              pathMap.set(shortPath, longPath)
              pathMap.set(longPath, shortPath)

              return shortPath
            }), { concurrency: PACKAGE_DIR_CONCURRENCY })

            res.end(JSON.stringify({
              type: 'image',
              files: shortPaths,
              items: Object.keys(result).reduce((acc, longPath) => {
                const allIds = new Set([...Object.keys(result[longPath].new), ...Object.keys(result[longPath].old)])
                const shortPath = pathMap.get(longPath)!

                return Array.from(allIds).reduce((acc, id) => {
                  if (Reflect.has(result[longPath].new, id)) {
                    if (Reflect.has(result[longPath].old, id)) {
                      acc[`${shortPath}:${id}`] = {
                        type: 'diff',
                        ...result[longPath].old[id],
                        newWidth: result[longPath].new[id].width,
                        newHeight: result[longPath].new[id].height,
                      }
                    } else {
                      acc[`${shortPath}:${id}`] = {
                        type: 'new',
                        ...result[longPath].new[id],
                      }
                    }
                  } else {
                    acc[`${shortPath}:${id}`] = {
                      type: 'deleted',
                      ...result[longPath].old[id],
                    }
                  }

                  return acc
                }, acc)
              }, {} as TScreenshotItems),
            }))

            return
          }

          const urlData = url.parse(req.url!, true)

          if (urlData.pathname === '/get') {
            const query = urlData.query as {
              id: string,
              type: TScreenshotResultType,
            }

            const { type } = query
            const [shortPath, id] = query.id.split(':')

            if (!isString(id)) {
              throw new Error(`?id param is required in ${req.url}`)
            }

            if (!isString(type)) {
              throw new Error(`?type param is required in ${req.url}`)
            }

            const file = pathMap.get(shortPath)

            if (isUndefined(file)) {
              throw new Error(`Cannot resolve "${shortPath}"`)
            }

            if (!Reflect.has(resultData, file)) {
              throw new Error(`There is no such file "${file}"`)
            }

            const items = resultData[file]

            if (!Reflect.has(items, type)) {
              throw new Error(`Cannot find "${file}" → "${type}"`)
            }

            if (!Reflect.has(items[type], id)) {
              throw new Error(`Cannot find "${file}" → "${type}" → "${id}"`)
            }

            res.setHeader('Content-Type', 'image/png')
            res.end(items[type][id], 'binary')
          }
        }

        if (req.method === 'POST') {
          if (req.url === '/save') {
            const ids = await new Promise<TScreenshotsSave>((resolve, reject) => {
              let body = ''

              req
                .on('data', (chunk) => {
                  body += chunk.toString()
                })
                .on('error', reject)
                .on('end', () => {
                  resolve(JSON.parse(body))
                })
            })

            console.log('SAVE', ids)

            const data = ids.reduce((result, item) => {
              const [shortPath, id] = item.split(':')

              if (!Array.isArray(result[shortPath])) {
                result[shortPath] = []
              }

              result[shortPath].push(id)

              return result
            }, {} as { [k: string]: string[] })

            await pAll(
              Object.keys(data).map((shortPath) => async () => {
                const file = pathMap.get(shortPath)

                if (isUndefined(file)) {
                  throw new Error(`Cannot resolve "${shortPath}"`)
                }

                const screenshotsDir = path.join(path.dirname(file), '__x-ray__')
                const tarPath = path.join(screenshotsDir, `${platform}-screenshots.tar`)

                await makeDir(screenshotsDir)

                const tar = await TarFs(tarPath)
                const ids = data[shortPath]

                ids.forEach((id) => {
                  tar.delete(id)
                })

                if (objectHas(resultData[file], 'new')) {
                  ids
                    .filter((id) => isDefined(resultData[file].new[id]))
                    .forEach((id) => {
                      tar.write(id, {
                        meta: result[file].new[id].serializedElement,
                        data: resultData[file].new[id],
                      })
                    })
                }

                await tar.save()
              }),
              { concurrency: SAVE_FILES_CONCURRENCY }
            )

            res.end()
            server.close(resolve)
          }
        }
      } catch (e) {
        reject(e)
      }
    })
    .on('error', reject)
    .listen(3001, 'localhost')
})

import { cpus } from 'os'
import http from 'http'
import path from 'path'
import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import pkgDir from 'pkg-dir'
import { TarFs } from '@x-ray/tar-fs'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import pAll from 'p-all'
import { isUndefined } from 'tsfn'
import { getTarFilePath } from './get-tar-file-path'
import { TCheckResults, TWorkerResult, THttpList } from './types'

// export type TCheckChomeScreenshotsOptions = {
//   dpr?: number,
//   width?: number,
//   height?: number,
// }

const MAX_THREAD_COUNT = cpus().length - 1
const WORKER_PATH = require.resolve('./worker-setup')
const OPTIMIZE_PNG_CONCURRENCY = 4
const PACKAGE_DIR_CONCURRENCY = 4
const SERVER_PORT = 3001
const SERVER_HOST = 'localhost'

type TResults = {
  [filePath: string]: TCheckResults<Uint8Array>,
}

const optimizePng = imageminPngout({ strategy: 2 })

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const results = {} as TResults

  await workerama({
    items: files,
    itemsPerThreadCount: 1,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [{ browserWSEndpoint }],
    onItemResult: (value: TWorkerResult<Uint8Array>) => {
      results[value.filePath] = value.results
    },
  })

  await new Promise<void>((resolve, reject) => {
    const pathMap = new Map<string, string>()

    http
      .createServer(async (req, res) => {
        try {
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

          if (req.method === 'GET') {
            if (req.url === '/list') {
              const shortPaths = await pAll<string>(
                Object.keys(results).map((longPath) => async () => {
                  const packageDir = await pkgDir(path.dirname(longPath))

                  if (isUndefined(packageDir)) {
                    throw new Error(`Cannot find package dir for "${longPath}"`)
                  }

                  const shortPath = path.relative(path.resolve('packages/'), packageDir)

                  pathMap.set(shortPath, longPath)
                  pathMap.set(longPath, shortPath)

                  return shortPath
                }),
                { concurrency: PACKAGE_DIR_CONCURRENCY }
              )

              res.end(
                JSON.stringify({
                  type: 'image',
                  files: shortPaths,
                  items: Object.entries(results).reduce((acc, [longPath, value]) => {
                    for (const [id, result] of Object.entries(value)) {
                      const key = `${pathMap.get(longPath)}:${id}`

                      switch (result.type) {
                        case 'NEW': {
                          acc[key] = {
                            type: 'NEW',
                            width: result.width,
                            height: result.height,
                          }

                          break
                        }
                        case 'DIFF': {
                          acc[key] = {
                            type: 'DIFF',
                            newWidth: result.newWidth,
                            newHeight: result.newHeight,
                            origWidth: result.origWidth,
                            origHeight: result.origHeight,
                          }

                          break
                        }
                        case 'DELETED': {
                          acc[key] = {
                            type: 'DELETED',
                            width: result.width,
                            height: result.height,
                          }

                          break
                        }
                      }
                    }

                    return acc
                  }, {} as THttpList),
                })
              )
            }
          }
        } catch (e) {
          // TODO: reject
          console.error(e)
        }
      })
      .on('error', reject)
      .listen(SERVER_PORT, SERVER_HOST)
  })

  // SAVE
  // for (const [filePath, result] of Object.entries(results)) {
  //   const tarFs = await TarFs(getTarFilePath(filePath))

  //   await pAll(
  //     Object.entries(result.new).map(([id, value]) => async () => {
  //       const dataBuffer = Buffer.from(value.data)
  //       const optimizedData = await optimizePng(dataBuffer)

  //       tarFs.write(id, {
  //         data: optimizedData,
  //         meta: value.meta,
  //       })
  //     }),
  //     { concurrency: OPTIMIZE_PNG_CONCURRENCY }
  //   )

  //   await pAll(
  //     Object.entries(result.diff).map(([id, value]) => async () => {
  //       const dataBuffer = Buffer.from(value.newData)
  //       const optimizedData = await optimizePng(dataBuffer)

  //       tarFs.write(id, {
  //         data: optimizedData,
  //         meta: value.meta,
  //       })
  //     }),
  //     { concurrency: OPTIMIZE_PNG_CONCURRENCY }
  //   )

  //   for (const fileToDelete of Object.keys(result.deleted)) {
  //     tarFs.delete(fileToDelete)
  //   }

  //   await tarFs.save()
  // }
}

export const main = async () => {
  await checkChromeScreenshots([
    require.resolve('./screenshots.tsx'),
  ])
}

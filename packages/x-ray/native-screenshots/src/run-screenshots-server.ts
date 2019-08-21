import path from 'path'
import http from 'http'
import upng from 'upng-js'
import { checkScreenshot, TScreenshotsResultData, TScreenshotsFileResultData, TRunScreesnotsResult, TScreenshotsResult, TScreenshotsFileResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { isUndefined, isString } from 'tsfn'
import { TLineElement } from 'syntx'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const dprSize = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100

export const runScreenshotsServer = (options: TOptions) => new Promise<() => Promise<TRunScreesnotsResult>>((serverResolve) => {
  const dpr = dprSize(options.dpr)
  const screenshotsPromise = new Promise<TRunScreesnotsResult>((screenshotsResolve, screenshotsReject) => {
    const result: TScreenshotsResult = {}
    const resultData: TScreenshotsResultData = {}
    let currentTar: TTarFs
    let currentFilePath: string
    let hasBeenChanged = false
    const startTime = Date.now()
    let okCount = 0
    let newCount = 0
    let deletedCount = 0
    let diffCount = 0

    let targetResult: TScreenshotsFileResult = {
      old: {},
      new: {},
    }
    let targetResultData: TScreenshotsFileResultData = {
      old: {},
      new: {},
    }

    const onFileDone = async (tar: TTarFs, filePath: string) => {
      if (!isUndefined(tar)) {
        for (const itemName of tar.list()) {
          if (Reflect.has(targetResult.old, itemName)) {
            continue
          }

          deletedCount++

          const { data, meta } = await tar.read(itemName) as TTarDataWithMeta
          const { width, height } = upng.decode(data.buffer)

          targetResult.old[itemName] = {
            width: dpr(width),
            height: dpr(height),
            serializedElement: meta as TLineElement[][],
          }
          targetResultData.old[itemName] = data

          hasBeenChanged = true
        }
      }

      // target file DONE
      if (isString(filePath)) {
        const relativePath = path.relative(process.cwd(), filePath)
        result[relativePath] = targetResult
        resultData[relativePath] = targetResultData

        targetResult = {
          old: {},
          new: {},
        }
        targetResultData = {
          old: {},
          new: {},
        }
      }
    }

    const server = http
      .createServer(async (req, res) => {
        if (req.method === 'POST') {
          if (req.url === '/upload') {
            let body = ''

            req
              .on('data', (chunk) => {
                body += chunk
              })
              .on('end', async () => {
                const { data, path: filePath, id, serializedElement } = JSON.parse(body)
                const screenshotsDir = path.join(path.dirname(filePath), '__x-ray__')
                const screenshotsTarPath = path.join(screenshotsDir, `${options.platform}-screenshots.tar`)
                const screenshot = Buffer.from(data, 'base64')

                if (currentFilePath !== filePath) {
                  await onFileDone(currentTar, currentFilePath)

                  currentFilePath = filePath

                  if (!isUndefined(currentTar)) {
                    await currentTar.close()
                  }

                  currentTar = await TarFs(screenshotsTarPath)
                }

                const action = await checkScreenshot(screenshot, currentTar, id)

                if (shouldBailout && (action.type === 'DIFF' || action.type === 'NEW')) {
                  res.writeHead(500)
                  res.end()

                  return server.close(() => screenshotsReject(null)) // eslint-disable-line
                }

                // switch
                switch (action.type) {
                  case 'OK': {
                    okCount++

                    break
                  }
                  case 'DIFF': {
                    targetResult.old[id] = {
                      serializedElement,
                      width: dpr(action.old.width),
                      height: dpr(action.old.height),
                    }
                    targetResult.new[id] = {
                      serializedElement,
                      width: dpr(action.new.width),
                      height: dpr(action.new.height),
                    }
                    targetResultData.old[id] = action.old.data
                    targetResultData.new[id] = action.new.data

                    hasBeenChanged = true

                    diffCount++

                    break
                  }
                  case 'NEW': {
                    targetResult.new[id] = {
                      serializedElement,
                      width: dpr(action.width),
                      height: dpr(action.height),
                    }
                    targetResultData.new[id] = action.data

                    hasBeenChanged = true

                    newCount++

                    break
                  }
                }

                res.writeHead(200)
                res.end()
              })
          } else if (req.url === '/error') {
            let body = ''

            req
              .on('data', (chunk) => {
                body += chunk
              })
              .on('end', () => {
                console.error(body)

                res.writeHead(500)
                res.end()

                return server.close(() => screenshotsReject(null)) // eslint-disable-line
              })
          }
        } else {
          res.writeHead(200)
          res.end()

          if (req.url === '/done') {
            await onFileDone(currentTar, currentFilePath)

            if (!isUndefined(currentTar)) {
              await currentTar.close()
            }

            console.log(`ok: ${okCount}`)
            console.log(`new: ${newCount}`)
            console.log(`deleted: ${deletedCount}`)
            console.log(`diff: ${diffCount}`)
            console.log(`done in ${Date.now() - startTime}ms`)

            server.close(() => screenshotsResolve({
              result,
              resultData,
              hasBeenChanged,
            }))
          }
        }
      })
      .listen(3002, '127.0.0.1', () => {
        serverResolve(() => screenshotsPromise)
      })
  })
})

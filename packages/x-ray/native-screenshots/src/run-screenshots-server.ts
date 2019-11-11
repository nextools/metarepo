import path from 'path'
import http from 'http'
import upng from 'upng-js'
import { checkScreenshot, TScreenshotsResultData, TScreenshotsFileResultData, TRunScreesnotsResult, TScreenshotsResult, TScreenshotsFileResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { isString, isNumber } from 'tsfn'
import prettyMs from 'pretty-ms'
import { TSyntxLines } from '@x-ray/common-utils'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const dprSize = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100

export const runScreenshotsServer = (options: TOptions) => new Promise<() => Promise<TRunScreesnotsResult>>((serverResolve) => {
  const dpr = dprSize(options.dpr)
  const screenshotsPromise = new Promise<TRunScreesnotsResult>((screenshotsResolve, screenshotsReject) => {
    const result: TScreenshotsResult = {}
    const resultData: TScreenshotsResultData = {}
    let currentTar: TTarFs | null = null
    let currentFilePath: string | null = null
    let hasBeenChanged = false
    let startTime: number | null = null
    let okCount = 0
    let newCount = 0
    let deletedCount = 0
    let diffCount = 0

    let screenshotsTakenNames: string[] = []
    let targetResult: TScreenshotsFileResult = {
      old: {},
      new: {},
    }
    let targetResultData: TScreenshotsFileResultData = {
      old: {},
      new: {},
    }

    const closeCurrentTar = async () => {
      if (currentTar !== null) {
        await currentTar.close()
      }

      currentTar = null
    }

    const onFileDone = async () => {
      if (currentTar !== null) {
        for (const itemName of currentTar.list()) {
          if (screenshotsTakenNames.includes(itemName)) {
            continue
          }

          deletedCount++

          const { data, meta } = await currentTar.read(itemName) as TTarDataWithMeta
          const { width, height } = upng.decode(data.buffer)

          targetResult.old[itemName] = {
            width: dpr(width),
            height: dpr(height),
            serializedElement: meta as TSyntxLines,
          }
          targetResultData.old[itemName] = data

          hasBeenChanged = true
        }
      }

      // target file DONE
      if (isString(currentFilePath)) {
        const relativePath = path.relative(process.cwd(), currentFilePath)
        result[relativePath] = targetResult
        resultData[relativePath] = targetResultData

        console.log(relativePath)

        screenshotsTakenNames = []
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
                try {
                  const { data, path: filePath, id, serializedElement } = JSON.parse(body)

                  if (currentFilePath !== filePath) {
                    await onFileDone()
                    await closeCurrentTar()
                  }

                  currentFilePath = filePath
                  screenshotsTakenNames.push(id)

                  if (currentTar === null) {
                    const screenshotsDir = path.join(path.dirname(filePath), '__data__')
                    const screenshotsTarPath = path.join(screenshotsDir, `${options.platform}-screenshots.tar.gz`)

                    currentTar = await TarFs(screenshotsTarPath)
                  }

                  const screenshot = Buffer.from(data, 'base64')
                  const action = await checkScreenshot(screenshot, currentTar, id)

                  if (shouldBailout && (action.type === 'DIFF' || action.type === 'NEW')) {
                    throw new Error(`${path.relative(process.cwd(), filePath)}:${id}:${action.type}`)
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
                } catch (e) {
                  res.writeHead(500)
                  res.end()

                  await closeCurrentTar()

                  return server.close(() => screenshotsReject(e))
                }
              })
          } else if (req.url === '/error') {
            let body = ''

            req
              .on('data', (chunk) => {
                body += chunk
              })
              .on('end', async () => {
                console.error(body)

                res.writeHead(500)
                res.end()

                await closeCurrentTar()

                return server.close(() => screenshotsReject(null)) // eslint-disable-line
              })
          }
        } else {
          res.writeHead(200)
          res.end()

          if (req.url === '/done') {
            await onFileDone()
            await closeCurrentTar()

            console.log(`ok: ${okCount}`)
            console.log(`new: ${newCount}`)
            console.log(`deleted: ${deletedCount}`)
            console.log(`diff: ${diffCount}`)

            if (isNumber(startTime)) {
              console.log(`done in ${prettyMs(Date.now() - startTime)}`)
            }

            server.close(() => screenshotsResolve({
              result,
              resultData,
              hasBeenChanged,
            }))
          }
        }
      })
      .listen(3002, '127.0.0.1', () => {
        serverResolve(() => {
          startTime = Date.now()

          return screenshotsPromise
        })
      })
  })
})

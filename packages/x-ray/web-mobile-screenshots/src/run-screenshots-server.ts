import path from 'path'
import http from 'http'
import { readdir, readFile } from 'pifs'
import pAll from 'p-all'
import upng from 'upng-js'
import { checkScreenshot, TScreenshotsResultData, TScreenshotsFileResultData, TRunScreesnotsResult, TScreenshotsResult, TScreenshotsFileResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { isNumber, isString } from 'tsfn'
import prettyMs from 'pretty-ms'
import { makeWorker } from '@x-ray/worker-utils'
import { Font, load as loadFont } from 'opentype.js'
import { TSyntxLines } from '@x-ray/common-utils'
import { TOptions, TWorkerHtmlResult, TWorkerResult } from './types'

const childFile = require.resolve('./child')
const pLoadFont = (fontFile: string) => new Promise<Font>((resolve, reject) => {
  loadFont(fontFile, (err, font) => {
    if (err) {
      reject(err)
    } else {
      resolve(font)
    }
  })
})
const shouldBailout = Boolean(process.env.XRAY_CI)
const dprSize = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100

export const runScreenshotsServer = (targetFiles: string[], options: TOptions) => new Promise<() => Promise<TRunScreesnotsResult>>((serverResolve) => {
  const dpr = dprSize(options.dpr)
  const screenshotsPromise = new Promise<TRunScreesnotsResult>((screenshotsResolve, screenshotsReject) => {
    const result: TScreenshotsResult = {}
    const resultData: TScreenshotsResultData = {}
    let currentItemData: TWorkerHtmlResult | null = null
    let currentTar: TTarFs | null = null
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
      if (currentItemData !== null) {
        const relativePath = path.relative(process.cwd(), currentItemData.path)
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

    const worker = makeWorker(childFile, {
      ...options,
      targetFiles,
    })

    const server = http
      .createServer(async (req, res) => {
        if (req.method === 'POST') {
          if (req.url === '/upload') {
            let screenshotData = ''

            req
              .on('data', (chunk) => {
                screenshotData += chunk
              })
              .on('end', async () => {
                try {
                  if (currentItemData === null) {
                    throw new Error('Invalid item data')
                  }

                  if (currentTar === null) {
                    throw new Error('Invalid tar')
                  }

                  screenshotsTakenNames.push(currentItemData.id)

                  const screenshot = Buffer.from(screenshotData, 'base64')
                  const action = await checkScreenshot(screenshot, currentTar, currentItemData.id)

                  if (shouldBailout && (action.type === 'DIFF' || action.type === 'NEW')) {
                    throw new Error(`${path.relative(process.cwd(), currentItemData.path)}:${currentItemData.id}:${action.type}`)
                  }

                  // switch
                  switch (action.type) {
                    case 'OK': {
                      okCount++

                      break
                    }
                    case 'DIFF': {
                      targetResult.old[currentItemData.id] = {
                        serializedElement: currentItemData.serializedElement,
                        width: dpr(action.old.width),
                        height: dpr(action.old.height),
                      }
                      targetResult.new[currentItemData.id] = {
                        serializedElement: currentItemData.serializedElement,
                        width: dpr(action.new.width),
                        height: dpr(action.new.height),
                      }
                      targetResultData.old[currentItemData.id] = action.old.data
                      targetResultData.new[currentItemData.id] = action.new.data

                      hasBeenChanged = true

                      diffCount++

                      break
                    }
                    case 'NEW': {
                      targetResult.new[currentItemData.id] = {
                        serializedElement: currentItemData.serializedElement,
                        width: dpr(action.width),
                        height: dpr(action.height),
                      }
                      targetResultData.new[currentItemData.id] = action.data

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

                  worker.kill()
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
                res.writeHead(200)
                res.end()

                worker.kill()
                await closeCurrentTar()

                return server.close(() => screenshotsReject(body)) // eslint-disable-line
              })
          }
        } else if (req.method === 'GET') {
          if (req.url === '/fonts') {
            if (!isString(options.fontsDir)) {
              res.writeHead(204)
              res.end()
            } else {
              const allFiles = await readdir(options.fontsDir)
              const fontFiles = allFiles.filter((file) => file.endsWith('.otf') || file.endsWith('.ttf'))

              const result = await pAll(
                fontFiles.map((fontFile) => async () => {
                  const fontFilePath = path.join(options.fontsDir!, fontFile)
                  const fontInfo = await pLoadFont(fontFilePath)
                  const fontFamily = Object.values((fontInfo.names as any).preferredFamily as string || fontInfo.names.fontFamily)[0]
                  const fontWeight = fontInfo.tables.os2.usWeightClass
                  const isItalic = fontInfo.tables.cff.topDict.italicAngle !== 0
                  const data = await readFile(fontFilePath, { encoding: 'base64' })

                  return {
                    file: fontFile,
                    data,
                    name: fontFamily,
                    weight: fontWeight,
                    isItalic,
                  }
                }),
                { concurrency: 10 }
              )

              res.end(JSON.stringify(result))
            }
          } else if (req.url === '/next') {
            worker.once('message', async (payload: TWorkerResult) => {
              switch (payload.type) {
                case 'NEXT': {
                  if (currentItemData !== null && currentItemData.path !== payload.path) {
                    await onFileDone()
                    await closeCurrentTar()
                  }

                  currentItemData = payload

                  if (currentTar === null) {
                    const screenshotsDir = path.join(path.dirname(currentItemData.path), '__data__')
                    const screenshotsTarPath = path.join(screenshotsDir, `${options.platform}-screenshots.tar.gz`)

                    currentTar = await TarFs(screenshotsTarPath)
                  }

                  res.end(payload.html)

                  return
                }
                case 'DONE': {
                  await onFileDone()
                  await closeCurrentTar()

                  console.log(`ok: ${okCount}`)
                  console.log(`new: ${newCount}`)
                  console.log(`deleted: ${deletedCount}`)
                  console.log(`diff: ${diffCount}`)

                  if (isNumber(startTime)) {
                    console.log(`done in ${prettyMs(Date.now() - startTime)}`)
                  }

                  res.writeHead(204)
                  res.end()

                  return server.close(() => screenshotsResolve({
                    result,
                    resultData,
                    hasBeenChanged,
                  }))
                }
                case 'ERROR': {
                  if (currentTar !== null) {
                    await currentTar.close()
                  }

                  console.error(payload.data)

                  res.writeHead(500)
                  res.end()

                  return server.close(() => screenshotsReject(null)) // eslint-disable-line
                }
              }
            })

            worker.send('next')
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

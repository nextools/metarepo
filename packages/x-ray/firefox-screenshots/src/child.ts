/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough */
import path from 'path'
import foxr from 'foxr'
import upng from 'upng-js'
import { checkScreenshot, TMeta, TScreenshotsItemResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { TCheckRequest, TSyntxLines } from '@x-ray/common-utils'
import { processSend } from '@x-ray/worker-utils'
import getScreenshot from './get'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)

export default async (options: TOptions) => {
  try {
    const { width, height } = options

    const browser = await foxr.connect({
      defaultViewport: {
        width,
        height,
      },
    })

    const page = await browser.newPage()
    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      process.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: Iterable<TMeta> }
              const screenshotsDir = path.join(path.dirname(action.path), '__data__')
              const tar = await TarFs(path.join(screenshotsDir, 'firefox-screenshots.tar.gz'))

              for (const item of items) {
                const screenshot = await getScreenshot(page, item)

                filenames.push(item.id)

                const message = await checkScreenshot(screenshot, tar, item.id)

                if (shouldBailout) {
                  switch (message.type) {
                    case 'DIFF':
                    case 'NEW': {
                      await browser.disconnect()

                      await processSend<TScreenshotsItemResult>({
                        type: 'BAILOUT',
                        reason: message.type,
                        id: item.id,
                        path: action.path,
                      })

                      process.disconnect()
                      process.exit(1)

                      throw null
                    }
                  }
                }

                switch (message.type) {
                  case 'DIFF':
                  case 'NEW': {
                    await processSend<TScreenshotsItemResult>({
                      ...message,
                      id: item.id,
                      serializedElement: item.serializedElement,
                    })

                    break
                  }
                  case 'OK': {
                    await processSend<TScreenshotsItemResult>({
                      type: 'OK',
                      id: item.id,
                    })

                    break
                  }
                }
              }

              for (const filename of tar.list()) {
                if (!filenames.includes(filename)) {
                  const { data, meta } = await tar.read(filename) as TTarDataWithMeta
                  const { width, height } = upng.decode(data)

                  await processSend<TScreenshotsItemResult>({
                    type: 'DELETED',
                    id: filename,
                    serializedElement: meta as TSyntxLines,
                    data,
                    width,
                    height,
                  })
                }
              }

              await tar.close()

              await processSend<TScreenshotsItemResult>({
                type: 'DONE',
                path: action.path,
              })

              break
            }
            case 'DONE': {
              await browser.disconnect()
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })

      processSend<TScreenshotsItemResult>({
        type: 'INIT',
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      await processSend<TScreenshotsItemResult>({
        type: 'ERROR',
        data: err.message,
      })
    }

    process.disconnect()
    process.exit(1)
  }

  process.disconnect()
  process.exit(0)
}

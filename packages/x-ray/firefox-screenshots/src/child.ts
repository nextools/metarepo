/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import foxr from 'foxr'
import upng from 'upng-js'
import { checkScreenshot, TMeta, TScreenshotsItemResult } from '@x-ray/screenshot-utils'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { TCheckRequest } from '@x-ray/common-utils'
import getScreenshot from './get'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const port = parentPort as any as MessagePort

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

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: TMeta[] }
              const screenshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(screenshotsDir, 'firefox-screenshots.tar'))

              for (const item of items) {
                const screenshot = await getScreenshot(page, item)
                const message = await checkScreenshot(screenshot, tar, item.id)

                if (shouldBailout) {
                  switch (message.type) {
                    case 'DIFF':
                    case 'NEW': {
                      await browser.disconnect()

                      port.postMessage({
                        type: 'BAILOUT',
                        id: item.id,
                      } as TScreenshotsItemResult)

                      port.close()

                      throw null
                    }
                  }
                }

                switch (message.type) {
                  case 'DIFF':
                  case 'NEW': {
                    port.postMessage({
                      ...message,
                      id: item.id,
                      serializedElement: item.serializedElement,
                    } as TScreenshotsItemResult)

                    break
                  }
                  case 'OK': {
                    port.postMessage({
                      type: 'OK',
                      id: item.id,
                    })

                    break
                  }
                }
              }

              for (const filename of tar.list()) {
                if (!items.find((metaItem) => metaItem.id === filename)) {
                  const { data, meta } = await tar.read(filename) as TTarDataWithMeta
                  const { width, height } = upng.decode(data)

                  port.postMessage({
                    type: 'DELETED',
                    id: filename,
                    serializedElement: meta,
                    data,
                    width,
                    height,
                  } as TScreenshotsItemResult)
                }
              }

              port.postMessage({
                type: 'DONE',
                path: action.path,
              } as TScreenshotsItemResult)

              break
            }
            case 'DONE': {
              await browser.disconnect()
              port.close()
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      port.postMessage({
        type: 'ERROR',
        data: err.message,
      } as TScreenshotsItemResult)
    }
  }
}

/* eslint-disable no-throw-literal, no-duplicate-case, no-fallthrough */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import puppeteer, { Page } from 'puppeteer-core'
import pAll from 'p-all'
import { TCheckRequest } from '@x-ray/common-utils'
import { checkScreenshot, TMeta, TScreenshotsItemResult } from '@x-ray/screenshot-utils'
import upng from 'upng-js'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { map } from 'iterama'
import getScreenshot from './get'
import { TOptions } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4
const port = parentPort as any as MessagePort

export default async (options: TOptions) => {
  try {
    const { dpr, width, height } = options

    const browser = await puppeteer.connect({
      browserWSEndpoint: options.webSocketDebuggerUrl,
      defaultViewport: {
        deviceScaleFactor: dpr,
        width,
        height,
      },
    } as any)

    const pagesPromises: Promise<Page>[] = []

    for (let i = 0; i < CONCURRENCY; ++i) {
      pagesPromises.push(browser.newPage())
    }

    const pages: Page[] = await Promise.all(pagesPromises)

    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: Iterable<TMeta> }
              const screenshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(screenshotsDir, 'chrome-screenshots.tar'))

              await pAll(
                map((item: TMeta) => async () => {
                  const page = pages.shift() as Page
                  const screenshot = await getScreenshot(page, item)

                  filenames.push(item.id)
                  pages.push(page)

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
                })(items),
                { concurrency: pages.length }
              )

              for (const filename of tar.list()) {
                if (!filenames.includes(filename)) {
                  const { data, meta } = await tar.read(filename) as TTarDataWithMeta

                  const { width, height } = upng.decode(data.buffer as ArrayBuffer)

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

              await tar.close()

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

/* eslint-disable no-throw-literal */
import path from 'path'
import { promisify } from 'util'
import puppeteer, { Page } from 'puppeteer-core'
import pAll from 'p-all'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TMessage } from '@x-ray/common-utils'
import { checkScreenshot, TMeta } from '@x-ray/screenshot-utils'
import getScreenshot from './get'

const webSocketDebuggerUrl = process.argv[2]
const options = process.argv[3]
const targetFiles = process.argv.slice(4)

const pathExists = promisify(fs.access)
const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))

;(async () => {
  try {
    const { setupFile, dpr, width, height } = JSON.parse(options)

    await import(setupFile)

    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
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

    for (const targetPath of targetFiles) {
      const { default: items } = await import(targetPath) as { default: TMeta[] }
      const screenshotsDir = path.join(path.dirname(targetPath), '__x-ray__', 'chrome-screenshots')

      if (!shouldBailout) {
        try {
          await pathExists(screenshotsDir)
        } catch (e) {
          await makeDir(screenshotsDir)
        }
      }

      await pAll(
        items.map((item) => async () => {
          const page = pages.shift() as Page
          const screenshot = await getScreenshot(page, item)
          const screenshotPath = path.join(screenshotsDir, `${item.options.name}.png`)

          pages.push(page)

          const message = await checkScreenshot(screenshot, screenshotPath, shouldBailout)

          await processSend(message)

          if (shouldBailout) {
            if (message.status === 'diff' || message.status === 'unknown') {
              throw null
            }
          }
        }),
        { concurrency: pages.length }
      )
    }

    await browser.disconnect()

    process.disconnect()
    process.exit(0) // eslint-disable-line
  } catch (err) {
    if (err !== null) {
      console.error(err)
    }

    process.disconnect()
    process.exit(1) // eslint-disable-line
  }
})()

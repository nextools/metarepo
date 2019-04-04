import path from 'path'
import { promisify } from 'util'
import foxr from 'foxr'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TItem, TMessage } from '@x-ray/common-utils'
import { checkScreenshot } from '@x-ray/screenshot-utils'
import getScreenshot from './get'

const options = process.argv[2]
const targetFiles = process.argv.slice(3)

const pathExists = promisify(fs.access)
const shouldBailout = Boolean(process.env.XRAY_CI)

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))

;(async () => {
  try {
    const { setupFile, width, height } = JSON.parse(options)

    await import(setupFile)

    const browser = await foxr.connect({
      defaultViewport: {
        width,
        height,
      },
    })

    const page = await browser.newPage()

    for (const targetPath of targetFiles) {
      const { default: items } = await import(targetPath) as { default: TItem[] }
      const screenshotsDir = path.join(path.dirname(targetPath), '__x-ray__', 'firefox-screenshots')

      if (!shouldBailout) {
        try {
          await pathExists(screenshotsDir)
        } catch (e) {
          await makeDir(screenshotsDir)
        }
      }

      for (const item of items) {
        const screenshot = await getScreenshot(page, item)
        const screenshotPath = path.join(screenshotsDir, `${item.meta.name}.png`)
        const message = await checkScreenshot(screenshot, screenshotPath, shouldBailout)

        await processSend(message)

        if (shouldBailout && (message.status === 'diff' || message.status === 'unknown')) {
          throw null
        }
      }
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

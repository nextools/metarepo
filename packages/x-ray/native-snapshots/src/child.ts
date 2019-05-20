/* eslint-disable no-throw-literal */
import { promisify } from 'util'
import path from 'path'
import pAll from 'p-all'
import fs from 'graceful-fs'
import makeDir from 'make-dir'
import { TMessage } from '@x-ray/common-utils'
import { checkSnapshot, TMeta } from '@x-ray/snapshot-utils'
import getSnapshot from './get'

const options = process.argv[2]
const targetFiles = process.argv.slice(3)
const pathExists = promisify(fs.access)

// @ts-ignore
const processSend: (message: TMessage) => Promise<void> = promisify(process.send.bind(process))
const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4

;(async () => {
  try {
    const { setupFile, platform, exportsMap } = JSON.parse(options)

    await import(setupFile)

    for (const targetPath of targetFiles) {
      const { default: items } = await import(targetPath) as { default: TMeta[] }
      const snapshotsDir = path.join(path.dirname(targetPath), '__x-ray__', `${platform}-snapshots`)

      if (!shouldBailout) {
        try {
          await pathExists(snapshotsDir)
        } catch (e) {
          await makeDir(snapshotsDir)
        }
      }

      await pAll(
        items.map((item) => async () => {
          const snapshot = await getSnapshot(item.element, exportsMap)
          const snapshotPath = path.join(snapshotsDir, `${item.options.name}.js`)
          const message = await checkSnapshot(snapshot, snapshotPath, shouldBailout)

          await processSend(message)

          if (shouldBailout) {
            if (message.status === 'diff' || message.status === 'unknown') {
              throw null
            }
          }
        }),
        { concurrency: CONCURRENCY }
      )
    }

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

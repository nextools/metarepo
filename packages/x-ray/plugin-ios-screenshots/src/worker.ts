import { parentPort } from 'worker_threads'
import { TTarMap, TarMap } from 'tarmap'
import { access } from 'pifs'
import { TJsonValue } from 'typeon'
import { getTarFilePath, TExampleResults } from '@x-ray/core'
import { hasScreenshotDiff } from './has-screenshot-diff'
import { bufferToPng } from './buffer-to-png'
import { ApplyDpr } from './apply-dpr'
import { TCheckOptions } from './types'

Buffer.poolSize = 0

export const check = (options: TCheckOptions) => {
  let currentPath: string
  const applyDpr = ApplyDpr(options.dpr)
  let tarMap = null as null | TTarMap
  const transferList = new Set<ArrayBuffer>()
  const results: TExampleResults<Buffer> = new Map()
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }

  parentPort!.on('message', async (item: IteratorResult<Uint8Array>) => {
    try {
      if (item.done) {
        if (tarMap !== null) {
          await tarMap.close()
        }

        process.exit()
      }

      const bodyString = new TextDecoder('utf-8').decode(item.value)
      const { path, name, id, meta, isDone, base64data } = JSON.parse(bodyString)
      const newScreenshot = Buffer.from(base64data, 'base64')

      if (currentPath !== path) {
        try {
          const tarFilePath = getTarFilePath({
            examplesFilePath: path,
            examplesName: name,
            pluginName: 'ios-screenshots',
          })

          await access(tarFilePath)

          tarMap = await TarMap(tarFilePath)
        } catch {
          tarMap = null
        }

        currentPath = path
      }

      // NEW
      if (tarMap === null || !tarMap.has(id)) {
        if (options.shouldBailout) {
          throw new Error(`BAILOUT: ${path} → ${id} → NEW`)
        }

        transferList.add(newScreenshot.buffer)

        const png = bufferToPng(newScreenshot)

        results.set(id, {
          type: 'NEW',
          meta,
          data: newScreenshot,
          width: applyDpr(png.width),
          height: applyDpr(png.height),
        })

        status.new++
      } else {
        const origScreenshot = await tarMap.read(id) as Buffer

        const origPng = bufferToPng(origScreenshot)
        const newPng = bufferToPng(newScreenshot)

        // DIFF
        if (hasScreenshotDiff(origPng, newPng)) {
          if (options.shouldBailout) {
            throw new Error(`BAILOUT: ${path} → ${id} → DIFF`)
          }

          transferList.add(origScreenshot.buffer)
          transferList.add(newScreenshot.buffer)

          results.set(id, {
            type: 'DIFF',
            meta,
            data: newScreenshot,
            width: applyDpr(newPng.width),
            height: applyDpr(newPng.height),
            origData: origScreenshot,
            origWidth: applyDpr(origPng.width),
            origHeight: applyDpr(origPng.height),
          })

          status.diff++
        // OK
        } else {
          results.set(id, { type: 'OK' })

          status.ok++
        }
      }

      parentPort!.postMessage({ type: 'EXAMPLE', isDone: false })

      if (isDone) {
        // DELETED
        if (tarMap !== null) {
          for (const id of tarMap.list()) {
            if (id.endsWith('-meta')) {
              continue
            }

            if (!results.has(id)) {
              if (options.shouldBailout) {
                throw new Error(`BAILOUT: ${path} → ${id} → DELETED`)
              }

              const deletedScreenshot = await tarMap.read(id) as Buffer
              const deletedPng = bufferToPng(deletedScreenshot)
              const metaId = `${id}-meta`
              let meta

              if (tarMap.has(metaId)) {
                const metaBuffer = await tarMap.read(metaId) as Buffer

                meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
              }

              transferList.add(deletedScreenshot.buffer)

              results.set(id, {
                type: 'DELETED',
                meta,
                data: deletedScreenshot,
                width: applyDpr(deletedPng.width),
                height: applyDpr(deletedPng.height),
              })

              status.deleted++
            }
          }

          await tarMap.close()
        }

        parentPort!.postMessage({
          type: 'EXAMPLE',
          isDone: true,
          value: [path, {
            name,
            results,
            status,
          }],
        }, Array.from(transferList))

        status.ok = 0
        status.new = 0
        status.diff = 0
        status.deleted = 0

        transferList.clear()
      }
    } catch (error) {
      const value = error instanceof Error ? error.message : error

      parentPort!.postMessage({ type: 'ERROR', value })
    }
  })
}

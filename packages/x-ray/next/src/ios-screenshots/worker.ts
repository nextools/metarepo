import { parentPort } from 'worker_threads'
import { TTarFs, TarFs } from '@x-ray/tar-fs'
import { access } from 'pifs'
import { TJsonValue } from 'typeon'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { bufferToPng } from '../utils/buffer-to-png'
import { ApplyDpr } from '../utils/apply-dpr'
import { hasScreenshotDiff } from '../utils/has-screenshot-diff'
import { TFileResults } from '../types'

Buffer.poolSize = 0

export const init = () => {
  const currentPath = null as null | string
  const applyDpr = ApplyDpr(2)
  let tarFs = null as null | TTarFs
  const transferList = [] as ArrayBuffer[]
  const results: TFileResults<Buffer> = new Map()
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }

  parentPort!.on('message', async (bodyArr: Uint8Array) => {
    try {
      const bodyString = new TextDecoder('utf-8').decode(bodyArr)
      const { path, name, id, meta, isDone, base64data } = JSON.parse(bodyString)
      const newScreenshot = Buffer.from(base64data, 'base64')

      if (currentPath !== path) {
        try {
          const tarFilePath = getTarFilePath(path, 'ios-screenshots')

          await access(tarFilePath)

          tarFs = await TarFs(tarFilePath)
        } catch {
          tarFs = null
        }
      }

      // NEW
      if (tarFs === null || !tarFs.has(id)) {
        transferList.push(newScreenshot.buffer)

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
        const origScreenshot = await tarFs.read(id) as Buffer

        const origPng = bufferToPng(origScreenshot)
        const newPng = bufferToPng(newScreenshot)

        // DIFF
        if (hasScreenshotDiff(origPng, newPng)) {
          transferList.push(origScreenshot.buffer)
          transferList.push(newScreenshot.buffer)

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
        if (tarFs !== null) {
          for (const id of tarFs.list()) {
            if (id.endsWith('-meta')) {
              continue
            }

            if (!results.has(id)) {
              const deletedScreenshot = await tarFs.read(id) as Buffer
              const deletedPng = bufferToPng(deletedScreenshot)
              const metaId = `${id}-meta`
              let meta

              if (tarFs.has(metaId)) {
                const metaBuffer = await tarFs.read(id) as Buffer

                meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
              }

              transferList.push(deletedScreenshot)

              results.set(id, {
                type: 'DELETED',
                data: deletedScreenshot,
                meta,
                width: applyDpr(deletedPng.width),
                height: applyDpr(deletedPng.height),
              })

              status.deleted++
            }
          }

          await tarFs.close()
        }

        parentPort!.postMessage({
          type: 'EXAMPLE',
          isDone: true,
          value: [path, {
            name,
            results,
            status,
          }],
        }, transferList)
      }
    } catch (error) {
      console.error(error)

      const value = error instanceof Error ? error.message : error

      parentPort!.postMessage({ type: 'ERROR', value })
    }
  })
}

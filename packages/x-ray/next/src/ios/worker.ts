import { parentPort } from 'worker_threads'
import { TTarFs, TarFs } from '@x-ray/tar-fs'
import { access } from 'pifs'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { bufferToPng } from '../utils/buffer-to-png'
import { ApplyDpr } from '../utils/apply-dpr'
import { hasScreenshotDiff } from '../utils/has-screenshot-diff'

Buffer.poolSize = 0

export const init = () => {
  const currentPath = null as null | string
  const applyDpr = ApplyDpr(2)
  let tarFs = null as null | TTarFs

  parentPort!.on('message', async (bodyArr: Uint8Array) => {
    try {
      const bodyString = new TextDecoder('utf-8').decode(bodyArr)
      const { path, id, base64data } = JSON.parse(bodyString)
      const newScreenshot = Buffer.from(base64data, 'base64')
      const transferList = [] as ArrayBuffer[]

      if (currentPath !== path) {
        try {
          const tarFilePath = getTarFilePath(path, 'ios')

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

        parentPort!.postMessage({
          type: 'DONE',
          id,
          path,
          value: {
            type: 'NEW',
            data: newScreenshot,
            width: applyDpr(png.width),
            height: applyDpr(png.height),
          },
        }, [newScreenshot.buffer])

        return
      }

      const origScreenshot = await tarFs.read(id) as Buffer

      const origPng = bufferToPng(origScreenshot)
      const newPng = bufferToPng(newScreenshot)

      // DIFF
      if (hasScreenshotDiff(origPng, newPng)) {
        transferList.push(origScreenshot.buffer)
        transferList.push(newScreenshot.buffer)

        parentPort!.postMessage({
          type: 'DONE',
          id,
          path,
          value: {
            type: 'DIFF',
            origData: origScreenshot,
            origWidth: applyDpr(origPng.width),
            origHeight: applyDpr(origPng.height),
            newData: newScreenshot,
            newWidth: applyDpr(newPng.width),
            newHeight: applyDpr(newPng.height),
          },
        }, [newScreenshot.buffer])

        return
      }

      // OK
      parentPort!.postMessage({
        type: 'DONE',
        id,
        path,
        value: {
          type: 'OK',
        },
      })
    } catch (error) {
      const value = error instanceof Error ? error.message : error

      parentPort?.postMessage({ type: 'ERROR', value })
    }
  })
}

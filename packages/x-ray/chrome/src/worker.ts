import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import pAll from 'p-all'
import { access } from 'pifs'
import { TTarDataWithMeta, TarFs, TTarFs } from '@x-ray/tar-fs'
import { getTarFilePath } from './get-tar-file-path'
import { TItem, TCheckResults, TWorkerResultInternal } from './types'
import { hasScreenshotDiff } from './has-screenshot-diff'
import { bufferToPng } from './buffer-to-png'

const SELECTOR = '[data-x-ray]'
const CONCURRENCY = 4

export type TCheckOptions = {
  browserWSEndpoint: string,
}

export const check = async ({ browserWSEndpoint }: TCheckOptions) => {
  const browser = await puppeteer.connect({ browserWSEndpoint })
  const pages = await Promise.all(
    new Array(CONCURRENCY).fill(null).map(() => browser.newPage())
  )

  return async (filePath: string): Promise<TWorkerResultInternal<Buffer>> => {
    const tarFilePath = getTarFilePath(filePath)
    let tarFs = null as null | TTarFs

    try {
      await access(tarFilePath)

      tarFs = await TarFs(tarFilePath)
    } catch {}

    const { items } = await import(filePath) as { items: TItem[] }
    const arrayBufferSet = new Set<ArrayBuffer>()
    const results = {} as TCheckResults<Buffer>

    await pAll(
      items.map((item) => async (): Promise<void> => {
        const html = renderToStaticMarkup(
          createElement(
            'div',
            { 'data-x-ray': true },
            item.element
          )
        )
        const page = pages.shift()!

        await page.setContent(html)

        const domElement = await page.$(SELECTOR) as ElementHandle
        const newScreenshot = await domElement.screenshot({ encoding: 'binary' })

        page.removeAllListeners()
        pages.push(page)

        // NEW
        if (tarFs === null || !tarFs.has(item.id)) {
          arrayBufferSet.add(newScreenshot.buffer)

          const png = bufferToPng(newScreenshot)

          results[item.id] = {
            type: 'NEW',
            meta: item.meta,
            data: newScreenshot,
            width: png.width,
            height: png.height,
          }

          return
        }

        const { data: origScreenshot, meta: origMeta } = await tarFs.read(item.id) as TTarDataWithMeta

        const origPng = bufferToPng(origScreenshot)
        const newPng = bufferToPng(newScreenshot)

        // DIFF
        if (hasScreenshotDiff(origPng, newPng)) {
          arrayBufferSet.add(origScreenshot.buffer)
          arrayBufferSet.add(newScreenshot.buffer)

          results[item.id] = {
            type: 'DIFF',
            origData: origScreenshot,
            origWidth: origPng.width,
            origHeight: origPng.height,
            newData: newScreenshot,
            newWidth: newPng.width,
            newHeight: newPng.height,
            meta: origMeta,
          }

          return
        }

        // OK
        results[item.id] = {
          type: 'OK',
        }
      }),
      { concurrency: CONCURRENCY }
    )

    if (tarFs !== null) {
      for (const id of tarFs.list()) {
        if (!Reflect.has(results, id)) {
          const { data, meta } = await tarFs.read(id) as TTarDataWithMeta
          const deletedPng = bufferToPng(data)

          results[id] = {
            type: 'DELETED',
            data,
            meta,
            width: deletedPng.width,
            height: deletedPng.height,
          }
        }
      }

      await tarFs.close()
    }

    return {
      value: {
        filePath,
        results,
      },
      transferList: Array.from(arrayBufferSet),
    }
  }
}

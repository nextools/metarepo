import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import pAll from 'p-all'
import { access } from 'pifs'
import { TTarDataWithMeta, TarFs, TTarFs } from '@x-ray/tar-fs'
import { getTarFilePath } from './get-tar-file-path'
import { TExample, TCheckResults, TWorkerResultInternal, TCheckOptions } from './types'
import { hasScreenshotDiff } from './has-screenshot-diff'
import { bufferToPng } from './buffer-to-png'
import { SCREENSHOTS_CONCURRENCY } from './constants'
import { ApplyDpr } from './apply-dpr'

const SELECTOR = '[data-x-ray]'

export const check = async ({ browserWSEndpoint, dpr }: TCheckOptions) => {
  const applyDpr = ApplyDpr(dpr)
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      deviceScaleFactor: dpr,
      width: 1024,
      height: 1024,
    },
  })
  const pages = await Promise.all(
    new Array(SCREENSHOTS_CONCURRENCY).fill(null).map(() => browser.newPage())
  )

  return async (filePath: string): Promise<TWorkerResultInternal<Buffer>> => {
    const tarFilePath = getTarFilePath(filePath)
    let tarFs = null as null | TTarFs

    try {
      await access(tarFilePath)

      tarFs = await TarFs(tarFilePath)
    } catch {}

    const { examples } = await import(filePath) as { examples: TExample[] }
    const arrayBufferSet = new Set<ArrayBuffer>()
    const status = {
      ok: 0,
      new: 0,
      diff: 0,
      deleted: 0,
    }
    const results = {} as TCheckResults<Buffer>

    await pAll(
      examples.map((getExample) => async (): Promise<void> => {
        const example = await getExample()

        const html = renderToStaticMarkup(
          createElement(
            'div',
            {
              'data-x-ray': true,
              style: {
                display: 'inline-block',
              },
            },
            example.element
          )
        )
        const page = pages.shift()!

        await page.setContent(html)

        const domElement = await page.$(SELECTOR) as ElementHandle
        const newScreenshot = await domElement.screenshot({ encoding: 'binary' })

        page.removeAllListeners()
        pages.push(page)

        // NEW
        if (tarFs === null || !tarFs.has(example.id)) {
          arrayBufferSet.add(newScreenshot.buffer)

          const png = bufferToPng(newScreenshot)

          status.new++

          results[example.id] = {
            type: 'NEW',
            meta: example.meta,
            data: newScreenshot,
            width: applyDpr(png.width),
            height: applyDpr(png.height),
          }

          return
        }

        const { data: origScreenshot, meta: origMeta } = await tarFs.read(example.id) as TTarDataWithMeta

        const origPng = bufferToPng(origScreenshot)
        const newPng = bufferToPng(newScreenshot)

        // DIFF
        if (hasScreenshotDiff(origPng, newPng)) {
          arrayBufferSet.add(origScreenshot.buffer)
          arrayBufferSet.add(newScreenshot.buffer)

          results[example.id] = {
            type: 'DIFF',
            origData: origScreenshot,
            origWidth: applyDpr(origPng.width),
            origHeight: applyDpr(origPng.height),
            newData: newScreenshot,
            newWidth: applyDpr(newPng.width),
            newHeight: applyDpr(newPng.height),
            meta: origMeta,
          }

          status.diff++

          return
        }

        // OK
        results[example.id] = {
          type: 'OK',
        }

        status.ok++
      }),
      { concurrency: SCREENSHOTS_CONCURRENCY }
    )

    if (tarFs !== null) {
      for (const id of tarFs.list()) {
        if (!Reflect.has(results, id)) {
          const { data, meta } = await tarFs.read(id) as TTarDataWithMeta
          const deletedPng = bufferToPng(data)

          arrayBufferSet.add(data)

          results[id] = {
            type: 'DELETED',
            data,
            meta,
            width: applyDpr(deletedPng.width),
            height: applyDpr(deletedPng.height),
          }

          status.deleted++
        }
      }

      await tarFs.close()
    }

    return {
      value: {
        filePath,
        results,
        status,
      },
      transferList: Array.from(arrayBufferSet),
    }
  }
}

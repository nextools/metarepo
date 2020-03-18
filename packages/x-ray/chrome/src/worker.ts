import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import pAll from 'p-all'
import { access } from 'pifs'
import { TTarDataWithMeta, TarFs, TTarFs } from '@x-ray/tar-fs'
import { getTarFilePath } from './get-tar-file-path'
import { TCheckResult, TItem } from './types'
import { hasScreenshotDiff } from './has-screenshot-diff'

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

  return async (filePath: string) => {
    const tarFilePath = getTarFilePath(filePath)
    let tarFs = null as null | TTarFs

    try {
      await access(tarFilePath)

      tarFs = await TarFs(tarFilePath)
    } catch {}

    const { items } = await import(filePath) as { items: TItem[] }
    const arrayBufferSet = new Set<ArrayBuffer>()

    const results = await pAll(
      items.map((item) => async (): Promise<TCheckResult> => {
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

          return {
            type: 'NEW',
            id: item.id,
            path: filePath,
            meta: item.meta,
            data: newScreenshot,
          }
        }

        const { data: origScreenshot, meta: origMeta } = await tarFs.read(item.id) as TTarDataWithMeta

        // DIFF
        if (hasScreenshotDiff(origScreenshot, newScreenshot)) {
          arrayBufferSet.add(newScreenshot.buffer)

          return {
            type: 'DIFF',
            id: item.id,
            path: filePath,
            data: newScreenshot,
            meta: origMeta,
          }
        }

        // OK
        return {
          type: 'OK',
          id: item.id,
          path: filePath,
        }
      }),
      { concurrency: CONCURRENCY }
    )

    if (tarFs !== null) {
      await tarFs.close()
    }

    return {
      value: results,
      transferList: Array.from(arrayBufferSet),
    }
  }
}

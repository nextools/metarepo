import path from 'path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import pAll from 'p-all'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { TCheckResult, TItem } from './types'
import { compareScreenshots } from './compare-screenshots'

const SELECTOR = '[data-x-ray]'
const PAGE_COUNT = 4

export type TCheckOptions = {
  browserWSEndpoint: string,
}

export const check = async ({ browserWSEndpoint }: TCheckOptions) => {
  const browser = await puppeteer.connect({ browserWSEndpoint })
  const pages = await Promise.all(
    new Array(PAGE_COUNT).fill(null).map(() => browser.newPage())
  )

  return async (file: string) => {
    const tarGzFilePath = path.join(path.dirname(file), 'chrome-screenshots.tar.gz')
    const tarFs = await TarFs(tarGzFilePath)

    const { items } = await import(file) as { items: TItem[] }
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
        if (!tarFs.has(item.id)) {
          arrayBufferSet.add(newScreenshot.buffer)

          return {
            type: 'NEW',
            id: item.id,
            path: file,
            meta: item.meta,
            data: newScreenshot,
          }
        }

        const { data: origScreenshot, meta: origMeta } = await tarFs.read(item.id) as TTarDataWithMeta

        // DIFF
        if (!compareScreenshots(origScreenshot, newScreenshot)) {
          arrayBufferSet.add(newScreenshot.buffer)

          return {
            type: 'DIFF',
            id: item.id,
            path: file,
            data: newScreenshot,
            meta: origMeta,
          }
        }

        // OK
        return {
          type: 'OK',
          id: item.id,
          path: file,
        }
      }),
      { concurrency: 4 }
    )

    await tarFs.close()

    return {
      value: results,
      transferList: Array.from(arrayBufferSet),
    }
  }
}

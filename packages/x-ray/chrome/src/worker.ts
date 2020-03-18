import path from 'path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import pAll from 'p-all'
import { TarFs } from '@x-ray/tar-fs'
import { TCheckResult, TItem } from './types'

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
        const screenshot = await domElement.screenshot({ encoding: 'binary' })

        page.removeAllListeners()
        pages.push(page)

        arrayBufferSet.add(screenshot.buffer)

        if (!tarFs.has(item.id)) {
          return {
            type: 'NEW',
            id: item.id,
            path: file,
            meta: item.meta,
            data: screenshot,
          }
        }

        if (tarFs.has(item.id)) {
          // const png = PNG.sync.read(screenshot)
          console.log('COMPARE')
        }

        return {
          type: 'OK',
          id: item.id,
          path: file,
          meta: item.meta,
          data: screenshot,
        }
      }),
      { concurrency: 4 }
    )

    await tarFs.close()

    // const png0 = PNG.sync.read(screenshots[0])
    // const png1 = PNG.sync.read(screenshots[1])

    // console.log(
    //   pixelmatch(
    //     png0.data,
    //     png1.data,
    //     null,
    //     png1.width,
    //     png1.height
    //   )
    // )

    return {
      value: results,
      transferList: Array.from(arrayBufferSet),
    }
  }
}

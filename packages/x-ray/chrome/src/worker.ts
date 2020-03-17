import { createElement, ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import pAll from 'p-all'

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

  console.log('CONNECTED')

  return async (file: string) => {
    console.log('FILE', file)

    const { elements } = await import(file) as { elements: ReactElement[] }

    const screenshots = await pAll<Buffer>(
      elements.map((element) => async () => {
        const html = renderToStaticMarkup(
          createElement(
            'div',
            { 'data-x-ray': true },
            element
          )
        )
        const page = pages.shift()!

        await page.setContent(html)

        const domElement = await page.$(SELECTOR) as ElementHandle
        const screenshot = await domElement.screenshot({ encoding: 'binary' })

        page.removeAllListeners()
        pages.push(page)

        return screenshot
      }),
      { concurrency: 1 }
    )

    const png0 = PNG.sync.read(screenshots[0])
    const png1 = PNG.sync.read(screenshots[1])

    console.log(
      pixelmatch(
        png0.data,
        png1.data,
        null,
        png1.width,
        png1.height
      )
    )

    const uniqueArrayBuffers = Array.from(new Set(screenshots.map((screenshot) => screenshot.buffer)))

    return {
      value: screenshots,
      transferList: uniqueArrayBuffers,
    }
  }
}

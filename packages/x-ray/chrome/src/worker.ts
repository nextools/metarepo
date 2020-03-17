import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'

export type TCheckOptions = {
  browserWSEndpoint: string,
}

const SELECTOR = '[data-x-ray]'

export const check = async ({ browserWSEndpoint }: TCheckOptions) => {
  const browser = await puppeteer.connect({ browserWSEndpoint })
  const page = await browser.newPage()

  console.log('CONNECTED')

  return async (file: string) => {
    console.log('FILE', file)

    const { elements } = await import(file)
    const html = renderToStaticMarkup(
      createElement(
        'div',
        { 'data-x-ray': true },
        elements[0]
      )
    )

    await page.setContent(html)

    const domElement = await page.$(SELECTOR) as ElementHandle
    const screenshot = await domElement.screenshot({ encoding: 'binary' })

    return {
      type: 'new',
      buffer: screenshot.buffer,
    }
  }
}

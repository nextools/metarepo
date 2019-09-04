import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Page, ElementHandle } from 'puppeteer-core'
import { TMeta, getContainerStyle } from '@x-ray/screenshot-utils'

const SELECTOR = '[data-x-ray]'

const getWebScreenshot = async (page: Page, { element, options }: TMeta): Promise<Buffer> => {
  const html = renderToStaticMarkup(
    createElement(
      'div',
      {
        'data-x-ray': true,
        style: getContainerStyle(options),
      },
      element
    )
  )

  await page.setContent(html)

  const domElement = await page.$(SELECTOR) as ElementHandle
  const screenshot = await domElement.screenshot({ encoding: 'binary' })

  return screenshot
}

export default getWebScreenshot

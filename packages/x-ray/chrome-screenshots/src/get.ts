import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Page, ElementHandle } from 'puppeteer-core'
import { TMeta } from '@x-ray/screenshot-utils'

const SELECTOR = '[data-x-ray]'

const getWebScreenshot = async (page: Page, { element, options }: TMeta): Promise<Buffer> => {
  const html = renderToStaticMarkup(
    createElement(
      'div',
      {
        'data-x-ray': true,
        style: {
          display: options.hasOwnWidth ? 'inline-block' : 'block',
          padding: options.negativeOverflow ? `${options.negativeOverflow}px` : 0,
          maxWidth: options.maxWidth ? `${options.maxWidth}px` : 'initial',
          backgroundColor: options.backgroundColor || '#fff',
        },
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

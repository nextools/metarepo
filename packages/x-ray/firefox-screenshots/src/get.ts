import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TMeta } from '@x-ray/screenshot-utils'
import { TPage, TElementHandle } from 'foxr'

const SELECTOR = '[data-x-ray]'

const getWebScreenshot = async (page: TPage, { element, options }: TMeta): Promise<Buffer> => {
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

  const domElement = await page.$(SELECTOR) as TElementHandle
  const screenshot = await domElement.screenshot()

  return screenshot
}

export default getWebScreenshot

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TMeta, getContainerStyle } from '@x-ray/screenshot-utils'
import { TPage, TElementHandle } from 'foxr'

const SELECTOR = '[data-x-ray]'

const getWebScreenshot = async (page: TPage, { element, options }: TMeta): Promise<Buffer> => {
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

  const domElement = await page.$(SELECTOR) as TElementHandle
  const screenshot = await domElement.screenshot()

  return screenshot
}

export default getWebScreenshot

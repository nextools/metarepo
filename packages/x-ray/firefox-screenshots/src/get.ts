import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TItem } from '@x-ray/common-utils'
import { TPage, TElementHandle } from 'foxr'

const SELECTOR = '[data-x-ray] > *:first-child'
const defaultStyles = {}
const hasOwnWidthStyles = {
  display: 'inline-block',
}

const getWebScreenshot = async (page: TPage, item: TItem): Promise<Buffer> => {
  const html = renderToStaticMarkup(
    createElement(
      'div',
      {
        'data-x-ray': true,
        style: item.meta.hasOwnWidth ? hasOwnWidthStyles : defaultStyles,
      },
      item.element
    )
  )

  await page.setContent(html)

  const domElement = await page.$(SELECTOR) as TElementHandle
  const screenshot = await domElement.screenshot()

  return screenshot
}

export default getWebScreenshot

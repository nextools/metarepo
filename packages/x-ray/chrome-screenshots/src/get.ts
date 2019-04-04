import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Page, ElementHandle } from 'puppeteer-core'
import { TItem } from '@x-ray/common-utils'

const SELECTOR = '[data-x-ray] > *:first-child'
const defaultStyles = {}
const hasOwnWidthStyles = {
  display: 'inline-block',
}

const getWebScreenshot = async (page: Page, item: TItem): Promise<Buffer> => {
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

  const domElement = await page.$(SELECTOR) as ElementHandle
  const screenshot = await domElement.screenshot({ encoding: 'binary' })

  return screenshot
}

export default getWebScreenshot

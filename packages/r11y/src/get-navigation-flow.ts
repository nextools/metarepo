import type { Page } from 'puppeteer-core'
import type { TNavigationItem, TWindow } from './types'

/* istanbul ignore next */
export const getNavigationFlow = async (page: Page): Promise<TNavigationItem[]> => {
  const navigationFlow = [] as TNavigationItem[]

  while (true) {
    await page.keyboard.press('Tab')

    const navigationItem: TNavigationItem = await page.evaluate(() => {
      const { getReactPath, getAttrs } = (window as any as TWindow).r11y
      const el = document.activeElement!
      const reactPath = getReactPath(el)

      return {
        path: reactPath,
        tag: el.tagName.toLowerCase(),
        attrs: getAttrs(el),
      }
    })

    if (navigationItem.tag === 'body') {
      break
    }

    navigationFlow.push(navigationItem)
  }

  return navigationFlow
}

import type { Page } from 'puppeteer-core'
import type { TWindow, TStringObject } from './types'

/* istanbul ignore next */
export const injectHelpers = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const getReactName = (el: Node) => {
      let reactName = null as string | null

      const key = Object.keys(el).find((key) => key.startsWith('__reactFiber$'))

      if (typeof key === 'string') {
        const { elementType } = (el as any)[key].return

        if (typeof elementType === 'string') {
          reactName = elementType
        } else if (typeof elementType.displayName === 'string') {
          reactName = elementType.displayName
        }
      }

      return reactName
    }

    (window as any as TWindow).r11y = {
      getReactName,
      getReactPath(el) {
        const reactName = getReactName(el)
        const parentReactName = getReactName(el.parentNode!)
        let reactPath = null

        if (reactName !== null) {
          reactPath = reactName

          if (parentReactName !== null) {
            reactPath = `${parentReactName} > ${reactPath}`
          }
        }

        return reactPath
      },
      getAttrs(el) {
        return Array
          .from(el.attributes)
          .reduce((attrs, attr) => {
            if (attr.name === 'type' || attr.name === 'role' || attr.name.startsWith('aria-')) {
              attrs[attr.name] = attr.value
            }

            return attrs
          }, {} as TStringObject)
      },
    }
  })
}

import axeCore from 'axe-core'
import type { Page } from 'puppeteer-core'
import axeRules from './axe-rules.json'
import type { TError, TWindow } from './types'

/* istanbul ignore next */
export const getErrors = (page: Page): Promise<TError[]> =>
  page.evaluate((axeSource: string, axeRules: string[]) => {
    const { getReactPath, getAttrs } = (window as any as TWindow).r11y

    // eslint-disable-next-line no-eval
    eval(axeSource)

    return ((window as any).axe as typeof axeCore)
      .run(document.getElementById('root')!, {
        reporter: 'no-passes',
        selectors: false,
        elementRef: true,
        runOnly: {
          type: 'rule',
          values: axeRules,
        },
      })
      .then((result) => {
        return result.violations.reduce((acc, item) => {
          for (const node of item.nodes) {
            const el = node.element!
            const reactPath = getReactPath(el)

            acc.push({
              rule: item.id,
              path: reactPath,
              tag: el.tagName.toLowerCase(),
              attrs: getAttrs(el),
            })
          }

          return acc
        }, [] as TError[])
      })
  }, axeCore.source, axeRules)

import { getAppPage } from 'foreal'
import { getErrors } from './get-errors'
import { getNavigationFlow } from './get-navigation-flow'
import { injectHelpers } from './inject-helpers'
import type { TGetA11yDataOptions, TA11Data } from './types'

export const getA11yData = async (options: TGetA11yDataOptions): Promise<TA11Data> => {
  const page = await getAppPage({
    entryPointPath: options.entryPointPath,
    fontsDir: options.fontsDir,
  })

  await injectHelpers(page)

  const errors = await getErrors(page)
  const navigationFlow = await getNavigationFlow(page)

  await page.close()

  return {
    errors,
    navigationFlow,
  }
}

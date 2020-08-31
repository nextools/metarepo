import { buildWebAppRelease } from '@rebox/web'
import dleet from 'dleet'
import puppeteer from 'puppeteer-core'
import tempy from 'tempy'
import { runBrowser } from 'xrom'
import { getErrors } from './get-errors'
import { getNavigationFlow } from './get-navigation-flow'
import { injectHelpers } from './inject-helpers'
import type { TGetA11yDataOptions, TA11Data } from './types'

const INJECTED_BUILD_FOLDER_PATH = '/home/chromium/html'

export const getA11yData = async (options: TGetA11yDataOptions): Promise<TA11Data> => {
  const tempBuildDir = tempy.directory()
  const { browserWSEndpoint, closeBrowser } = await runBrowser({
    browser: 'chromium',
    version: 'latest',
    fontsDir: options.fontsDir,
    mountVolumes: [
      {
        from: tempBuildDir,
        to: INJECTED_BUILD_FOLDER_PATH,
      },
    ],
  })
  const browser = await puppeteer.connect({ browserWSEndpoint })

  await buildWebAppRelease({
    entryPointPath: options.entryPointPath,
    outputPath: tempBuildDir,
    htmlTemplatePath: require.resolve('./app.html'),
    browsersList: ['last 1 Chrome version'],
    isQuiet: true,
    shouldGenerateSourceMaps: false,
    shouldGenerateBundleAnalyzerReport: false,
  })

  const page = await browser.newPage()

  await page.goto(`file://${INJECTED_BUILD_FOLDER_PATH}/index.html`, { waitUntil: 'networkidle0' })

  await injectHelpers(page)

  const errors = await getErrors(page)
  const navigationFlow = await getNavigationFlow(page)

  await page.close()
  await browser.close()
  await closeBrowser()
  await dleet(tempBuildDir)

  return {
    errors,
    navigationFlow,
  }
}

import { buildWebAppRelease } from '@rebox/web'
import dleet from 'dleet'
import puppeteer from 'puppeteer-core'
import type { Page, PageCloseOptions } from 'puppeteer-core'
import { getTempDirPath } from 'tmpa'
import { runBrowser } from 'xrom'

const INJECTED_BUILD_FOLDER_PATH = '/home/chromium/html'

export type TGetAppPageOptions = {
  entryPointPath: string,
  fontsDir?: string,
  width?: number,
  height?: number,
  deviceScaleFactor?: number,
}

export const getAppPage = async (options: TGetAppPageOptions): Promise<Page> => {
  const tempBuildDirPath = await getTempDirPath()
  const { browserWSEndpoint, closeBrowser } = await runBrowser({
    browser: 'chromium',
    version: 'latest',
    fontsDir: options.fontsDir,
    mountVolumes: [
      {
        from: tempBuildDirPath,
        to: INJECTED_BUILD_FOLDER_PATH,
      },
    ],
  })
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: options.width ?? 800,
      height: options.height ?? 600,
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
    },
  })

  await buildWebAppRelease({
    entryPointPath: options.entryPointPath,
    outputPath: tempBuildDirPath,
    htmlTemplatePath: require.resolve('./app.html'),
    browsersList: ['last 1 Chrome version'],
    isQuiet: true,
    shouldGenerateSourceMaps: false,
    shouldGenerateBundleAnalyzerReport: false,
  })

  const page = await browser.newPage()
  const originalPageClose = page.close

  page.close = async (options: PageCloseOptions): Promise<void> => {
    await originalPageClose.call(page, options)
    await closeBrowser()
    await dleet(tempBuildDirPath)
  }

  await page.goto(`file://${INJECTED_BUILD_FOLDER_PATH}/index.html`, { waitUntil: 'networkidle0' })

  return page
}

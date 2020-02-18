import puppeteer from 'puppeteer-core'
import { buildRelease } from '@rebox/web'
import { getObjectEntries } from 'tsfn'
import tempy from 'tempy'
import dleet from 'dleet'
import { runChromium } from 'xrom'
import { getPerfPaintEntryValue } from './get-perf-paint-entry-value'
import { getPerfMetricsEntryValue } from './get-perf-metrics-entry-value'
import { getPercentile } from './get-percentile'
import { TPerfResult, TPerfObserverEntry, TPerfPaint, TPerfMetrics } from './types'

const TRIES_COUNT = 5
const INJECTED_BUILD_FOLDER_PATH = '/home/chromium/html'

export type TGetPerfDataOptions = {
  entryPointPath: string,
  triesCount?: number,
  fontsDir?: string,
  isQuiet?: boolean,
}

export const getPerfData = async (userOptions: TGetPerfDataOptions): Promise<TPerfResult> => {
  const options = {
    triesCount: TRIES_COUNT,
    isQuiet: false,
    ...userOptions,
  }
  const tempBuildDir = tempy.directory()
  const browserWSEndpoint = await runChromium({
    cpus: 1,
    cpusetCpus: [1],
    fontsDir: options.fontsDir,
    mountVolumes: [
      {
        from: tempBuildDir,
        to: INJECTED_BUILD_FOLDER_PATH,
      },
    ],
    shouldCloseOnExit: true,
  })
  const browser = await puppeteer.connect({ browserWSEndpoint })

  await buildRelease({
    entryPointPath: options.entryPointPath,
    outputPath: tempBuildDir,
    htmlTemplatePath: require.resolve('./app.html'),
    isQuiet: true,
    shouldGenerateSourceMaps: false,
    shouldGenerateBundleAnalyzerReport: false,
  })

  const result = {
    firstContentfulPaint: [] as number[],
    firstMeaningfulPaint: [] as number[],
    largestContentfulPaint: [] as number[],
    domContentLoaded: [] as number[],
    threadTime: [] as number[],
    scriptDuration: [] as number[],
    layoutDuration: [] as number[],
    recalcStyleDuration: [] as number[],
    usedJsHeapSize: [] as number[],
  }

  for (let i = 0; i < options.triesCount; i++) {
    if (!options.isQuiet) {
      console.log('tries:', `${i + 1}/${options.triesCount}`)
    }

    const page = await browser.newPage()
    const client = await page.target().createCDPSession()

    await client.send('Performance.enable')
    // await client.send('Emulation.setCPUThrottlingRate', { rate: 2 })

    await page.goto(`file://${INJECTED_BUILD_FOLDER_PATH}/index.html`, { waitUntil: 'networkidle0' })

    // const pageMetrics = await page.metrics()
    // const perfTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)))
    const perfPaint = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('paint')))) as TPerfPaint

    const perfMetrics = await client.send('Performance.getMetrics') as TPerfMetrics

    const largestContentfulPaint = await page.evaluate(() => new Promise((resolve) => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as unknown as TPerfObserverEntry[]
        const lastEntry = entries[entries.length - 1]

        resolve(lastEntry.renderTime || lastEntry.loadTime)
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    })) as number

    result.firstContentfulPaint.push(getPerfPaintEntryValue(perfPaint, 'first-contentful-paint'))
    result.firstMeaningfulPaint.push(
      getPerfMetricsEntryValue(perfMetrics, 'FirstMeaningfulPaint') * 1000 - getPerfMetricsEntryValue(perfMetrics, 'NavigationStart') * 1000
    )
    result.largestContentfulPaint.push(largestContentfulPaint)
    result.domContentLoaded.push(
      getPerfMetricsEntryValue(perfMetrics, 'DomContentLoaded') * 1000 - getPerfMetricsEntryValue(perfMetrics, 'NavigationStart') * 1000
    )
    result.threadTime.push(getPerfMetricsEntryValue(perfMetrics, 'ThreadTime') * 1000)
    result.scriptDuration.push(getPerfMetricsEntryValue(perfMetrics, 'ScriptDuration') * 1000)
    result.layoutDuration.push(getPerfMetricsEntryValue(perfMetrics, 'LayoutDuration') * 1000)
    result.recalcStyleDuration.push(getPerfMetricsEntryValue(perfMetrics, 'RecalcStyleDuration') * 1000)
    result.usedJsHeapSize.push(getPerfMetricsEntryValue(perfMetrics, 'JSHeapUsedSize') / 1024 / 1024)

    await page.close()
  }

  await browser.close()
  await dleet(tempBuildDir)

  return getObjectEntries(result).reduce((acc, [key, value]) => {
    acc[key] = getPercentile(value.sort((a, b) => a - b), 0.5)

    return acc
  }, {} as TPerfResult)
}

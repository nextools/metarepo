import puppeteer from 'puppeteer-core'
import { buildRelease } from '@rebox/web'
import { isUndefined, getObjectEntries } from 'tsfn'
import { TPerfResult } from './types'
import { BUILD_FOLDER_PATH, INJECTED_BUILD_FOLDER_PATH, TRIES_COUNT } from './utils'

type TPerfPaint = {
  name: 'first-paint' | 'first-contentful-paint',
  startTime: number,
}[]

type TPerfMetrics = {
  metrics: {
    name: string,
    value: number,
  }[],
}

type TPerfObserverEntry = {
  renderTime?: number,
  loadTime: number,
}

const getPerfPaintEntryValue = (perf: TPerfPaint, key: string): number => {
  const entry = perf.find((entry) => entry.name === key)

  if (isUndefined(entry)) {
    return 0
  }

  return entry.startTime
}

const getPerfMetricsEntryValue = (perf: TPerfMetrics, key: string): number => {
  const entry = perf.metrics.find((entry) => entry.name === key)

  if (isUndefined(entry)) {
    return 0
  }

  return entry.value
}

const getPercentile = (arr: number[], p: number): number => {
  const index = (arr.length - 1) * p
  const lower = Math.floor(index)
  const upper = lower + 1
  const weight = index % 1

  if (upper >= arr.length) {
    return arr[lower]
  }

  return arr[lower] * (1 - weight) + arr[upper] * weight
}

type TGetPerfDataOptions = {
  entryPointPath: string,
  browserWSEndpoint: string,
}

export const getPerfData = async ({ entryPointPath, browserWSEndpoint }: TGetPerfDataOptions): Promise<TPerfResult> => {
  const browser = await puppeteer.connect({ browserWSEndpoint })

  await buildRelease({
    entryPointPath: require.resolve('./app-wrapper.tsx'),
    outputPath: BUILD_FOLDER_PATH,
    htmlTemplatePath: require.resolve('./demo.html'),
    globalAliases: {
      __XRAY_PERF_APP_PATH__: entryPointPath,
    },
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

  for (let i = 0; i < TRIES_COUNT; i++) {
    console.log('tries:', `${i + 1}/${TRIES_COUNT}`)

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

  await browser.disconnect()

  return getObjectEntries(result).reduce((acc, [key, value]) => {
    acc[key] = getPercentile(value.sort((a, b) => a - b), 0.5)

    return acc
  }, {} as TPerfResult)
}

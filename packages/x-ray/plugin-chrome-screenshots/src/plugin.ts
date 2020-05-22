import { runBrowser } from 'xrom'
import { workerama } from 'workerama'
import { forEachAsync, toMapAsync } from 'iterama'
import { pipe } from 'funcom'
import { TPlugin } from '@x-ray/core'
import { TCheckOptions, TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export type TChromeScreenshotsOptions = {
  fontsDir?: string,
  shouldBailout?: boolean,
}

export const chromeScreenshots = (options?: TChromeScreenshotsOptions): TPlugin<Uint8Array> => ({
  name: 'chrome-screenshots',
  encoding: 'image',
  appEntryPointPath: require.resolve('./App.tsx'),
  getResults: async (files) => {
    const opts = {
      shouldBailout: false,
      ...options,
    }
    const { browserWSEndpoint, closeBrowser } = await runBrowser({
      browser: 'firefox',
      version: 'latest',
      fontsDir: opts?.fontsDir,
    })

    try {
      const checkOptions: TCheckOptions = {
        browserWSEndpoint,
        dpr: 2,
        shouldBailout: opts.shouldBailout,
      }

      const totalResultsIterable = workerama<TWorkerResult<Uint8Array>>({
        items: files,
        maxThreadCount: MAX_THREAD_COUNT,
        fnFilePath: WORKER_PATH,
        fnName: 'check',
        fnArgs: [checkOptions],
      })

      const totalResults = await pipe(
        forEachAsync((entry: TWorkerResult<Uint8Array>) => console.log(entry[1].name)),
        toMapAsync
      )(totalResultsIterable)

      return totalResults
    } finally {
      await closeBrowser()
    }
  },
})

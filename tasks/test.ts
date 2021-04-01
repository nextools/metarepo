import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { ReportOptions } from 'istanbul-reports'
import type { TPlugin, TSourceMap, TTask } from './types'

type TReporterName = keyof ReportOptions

const testIt = (): TPlugin<string, CoverageMapData> => async function* (it) {
  const { fileURLToPath } = await import('url')
  const { pipe } = await import('funcom')
  const { drainAsync, mapAsync, ungroupAsync } = await import('iterama')
  const { piAll } = await import('piall')
  const { CoverageInstrumenter } = await import('collect-v8-coverage')
  const { default: v8toIstanbul } = await import('v8-to-istanbul')
  const { fromSource: getSourceMapFromSource } = await import('convert-source-map')
  const { sourcesKey } = await import('@start/ts-esm-loader')

  const instrumenter = new CoverageInstrumenter()
  const piAlled = piAll(8)
  const globl = global as any

  yield* pipe(
    mapAsync(async (testFilePath: string) => {
      await instrumenter.startInstrumenting()

      globl[sourcesKey] = {}

      const { tests } = await import(`${testFilePath}?nocache`)

      try {
        await drainAsync(piAlled(tests))
      } catch (err) {
        console.error(testFilePath)
        console.error(err.message)
      }

      const v8Coverages = await instrumenter.stopInstrumenting()
      const istanbulCoverages: CoverageMapData[] = []

      for (const coverage of v8Coverages) {
        if (!coverage.url.startsWith('file:///')) {
          continue
        }

        const sourceFilePath = fileURLToPath(coverage.url)

        if (sourceFilePath !== testFilePath.replace('/test_/', '/src/')) {
          continue
        }

        const source = globl[sourcesKey][sourceFilePath] as string
        const sourcemap = getSourceMapFromSource(source)!.toObject() as TSourceMap
        const converter = v8toIstanbul(sourceFilePath, 0, { source, sourceMap: { sourcemap } })

        await converter.load()

        converter.applyCoverage(coverage.functions)
        istanbulCoverages.push(converter.toIstanbul())
      }

      // never happened
      delete globl[sourcesKey]

      return istanbulCoverages
    }),
    ungroupAsync
  )(it)
}

const reportIt = (reporterNames: TReporterName[]): TPlugin<CoverageMapData, CoverageMapData> => async function* (it) {
  const { pipe } = await import('funcom')
  const { forEachAsync, finallyAsync } = await import('iterama')
  const { default: { createCoverageMap } } = await import('istanbul-lib-coverage')
  const { createContext: createReportContext } = await import('istanbul-lib-report')
  const { create: createReporter } = await import('istanbul-reports')

  const coverageMap = createCoverageMap()

  yield* pipe(
    forEachAsync((coverageMapData: CoverageMapData) => {
      coverageMap.merge(coverageMapData)
    }),
    finallyAsync(() => {
      const context = createReportContext({ dir: 'coverage/', coverageMap })

      for (const reporterName of reporterNames) {
        // @ts-expect-error
        createReporter(reporterName).execute(context)
      }
    })
  )(it)
}

export const test: TTask<string, any> = async function* (pkg = 'iterama') {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  const { mapThreadPool } = await import('@start/thread-pool')

  yield* pipe(
    find('coverage/'),
    remove,
    find(`packages/${pkg}/test_/*.{ts,tsx}`),
    // testIt(),
    mapThreadPool(testIt, null),
    reportIt(['html'])
  )()
}

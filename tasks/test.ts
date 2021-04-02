import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { ReportOptions } from 'istanbul-reports'
import type { TPlugin, TSourceMap, TTask } from './types'

type TReporterName = keyof ReportOptions

const testIt = (sourcesDir: string): TPlugin<string, CoverageMapData> => async function* (it) {
  const path = await import('path')
  const { fileURLToPath } = await import('url')
  const { pipe } = await import('funcom')
  const { drainAsync, mapAsync, ungroupAsync } = await import('iterama')
  const { piAll } = await import('piall')
  const { default: movePath } = await import('move-path')
  const { startCollectingCoverage } = await import('./coverage')
  const { default: v8toIstanbul } = await import('v8-to-istanbul')
  const { fromSource: getSourceMapFromSource } = await import('convert-source-map')

  const sourcesKey = '@@start-sources'
  const piAlled = piAll(8)
  const globl = global as any

  yield* pipe(
    mapAsync(async (testFilePath: string) => {
      // trigger @start/ts-esm-loader to collect transpiled code with inlined source maps
      globl[sourcesKey] = {}

      const stopCollectingCoverage = await startCollectingCoverage()
      const { tests } = await import(`${testFilePath}?nocache`)

      try {
        await drainAsync(piAlled(tests))
      } catch (err) {
        console.error(testFilePath)
        console.error(err.message)
      }

      const v8Coverages = await stopCollectingCoverage()
      const istanbulCoverages: CoverageMapData[] = []

      for (const v8Coverage of v8Coverages) {
        // skip internal modules
        if (!v8Coverage.url.startsWith('file://')) {
          continue
        }

        const sourceFilePath = fileURLToPath(v8Coverage.url)

        // test/index.ts -> src/*.ts
        if (path.basename(testFilePath) === 'index.ts') {
          if (!sourceFilePath.startsWith(sourcesDir)) {
            continue
          }
        // test/foo.ts -> src/foo.ts
        } else {
          const expectedSourceFilePath = movePath(testFilePath, sourcesDir)

          if (sourceFilePath !== expectedSourceFilePath) {
            continue
          }
        }

        // get transpiled by @start/ts-esm-loader code
        const source = globl[sourcesKey][sourceFilePath] as string
        // and extract source map from it
        const sourcemap = getSourceMapFromSource(source)!.toObject() as TSourceMap
        const converter = v8toIstanbul(sourceFilePath, 0, { source, sourceMap: { sourcemap } })

        await converter.load()

        converter.applyCoverage(v8Coverage.functions)
        istanbulCoverages.push(converter.toIstanbul())
      }

      // never happened
      delete globl[sourcesKey]

      return istanbulCoverages
    }),
    ungroupAsync
  )(it)
}

const reportCoverage = (coverageDir: string, reporterNames: TReporterName[] = ['html']): TPlugin<CoverageMapData, CoverageMapData> => async function* (it) {
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
      const context = createReportContext({ dir: coverageDir, coverageMap })

      for (const reporterName of reporterNames) {
        // @ts-expect-error
        createReporter(reporterName).execute(context)
      }
    })
  )(it)
}

export const test: TTask<string, CoverageMapData> = async function* (pkg = 'iterama') {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  const { mapThreadPool } = await import('@start/thread-pool')

  yield* pipe(
    find('coverage/'),
    remove,
    find(`packages/${pkg}/test_/*.{ts,tsx}`),
    // testIt(`packages/${pkg}/src/`),
    mapThreadPool(testIt, `packages/${pkg}/src/`),
    reportCoverage('coverage/')
  )()
}

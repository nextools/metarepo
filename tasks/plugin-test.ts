import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { ReportOptions } from 'istanbul-reports'
import type { TPlugin } from './types'

export type TReporterName = keyof ReportOptions

export type TTestFile = {
  tests: Iterable<() => void | Promise<void>>,
  target: string,
}

export const test = (): TPlugin<string, CoverageMapData> => async function* (it) {
  const { resolve, join, dirname } = await import('path')
  const { fileURLToPath } = await import('url')
  const { pipe } = await import('funcom')
  const { drainAsync, mapAsync, ungroupAsync } = await import('iterama')
  const { default: picomatch } = await import('picomatch')
  const { piAll } = await import('piall')
  const { startCollectingCoverage } = await import('./coverage')
  const { default: v8toIstanbul } = await import('v8-to-istanbul')

  const transpiledSourcesKey = '@@start-transpiled-sources'
  const piAlled = piAll(8)
  const globl = global as any

  yield* pipe(
    mapAsync(async (testFilePath: string) => {
      // trigger @start/ts-esm-loader to collect transpiled code with inlined source maps
      globl[transpiledSourcesKey] = {}

      const testFileFullPath = resolve(testFilePath)
      const stopCollectingCoverage = await startCollectingCoverage()
      const { tests, target } = await import(`${testFileFullPath}?nocache=${Date.now()}`) as TTestFile
      // `a/b/c/test/foo.ts` + `../src/f*.ts` -> /a/b/c/src/f*.ts
      const isMatch = picomatch(join(dirname(testFileFullPath), target))

      await drainAsync(piAlled(tests))

      const v8Coverages = await stopCollectingCoverage()
      const istanbulCoverages = new Map<string, CoverageMapData>()

      for (const v8Coverage of v8Coverages) {
        // skip internal modules
        if (!v8Coverage.url.startsWith('file://')) {
          continue
        }

        const sourceFilePath = fileURLToPath(v8Coverage.url)

        if (!isMatch(sourceFilePath)) {
          continue
        }

        // get transpiled by @start/ts-esm-loader code
        const transpiledSource = globl[transpiledSourcesKey][sourceFilePath] as string
        const converter = v8toIstanbul(sourceFilePath, 0, { source: transpiledSource })

        await converter.load()

        converter.applyCoverage(v8Coverage.functions)
        // TODO: should we merge same paths insead of replacing it?
        istanbulCoverages.set(testFilePath, converter.toIstanbul())
      }

      // never happened
      delete globl[transpiledSourcesKey]

      return istanbulCoverages.values()
    }),
    ungroupAsync
  )(it)
}

export const reportCoverage = (coverageDir: string, reporterNames: TReporterName[] = ['html']): TPlugin<CoverageMapData, CoverageMapData> => async function* (it) {
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

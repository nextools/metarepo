import type { TPlugin, TSourceMap, TTask } from './types'

const testIt = (): TPlugin<string, string> => async function* (it) {
  const { fileURLToPath } = await import('url')
  const { drainAsync, mapAsync } = await import('iterama')
  const { piAll } = await import('piall')
  const { CoverageInstrumenter } = await import('collect-v8-coverage')
  const { default: v8toIstanbul } = await import('v8-to-istanbul')
  const { default: { createCoverageMap } } = await import('istanbul-lib-coverage')
  const { default: { createContext } } = await import('istanbul-lib-report')
  const reports = await import('istanbul-reports')
  const { fromSource: getSourceMapFromSource } = await import('convert-source-map')
  const { sourcesKey } = await import('@start/ts-esm-loader')

  const instrumenter = new CoverageInstrumenter()
  const coverageMap = createCoverageMap()
  const piAlled = piAll(8)

  await instrumenter.startInstrumenting()

  const globl = global as any

  globl[sourcesKey] = {}

  yield* mapAsync(async (filePath: string) => {
    const { tests } = await import(`${filePath}?nocache`)

    try {
      await drainAsync(piAlled(tests))
    } catch (err) {
      console.error(filePath)
      console.error(err.message)
    }

    return filePath
  })(it)

  const coverages = await instrumenter.stopInstrumenting()

  for (const coverage of coverages) {
    if (coverage.url.includes('iterama/src/concat.ts')) {
      const filePath = fileURLToPath(coverage.url)
      const source = globl[sourcesKey][filePath] as string
      const sourcemap = getSourceMapFromSource(source)!.toObject() as TSourceMap
      const converter = v8toIstanbul(filePath, 0, { source, sourceMap: { sourcemap } })

      await converter.load()

      converter.applyCoverage(coverage.functions)
      coverageMap.merge(converter.toIstanbul())
    }
  }

  // never happened
  delete globl[sourcesKey]

  const context = createContext({ dir: 'coverage/', coverageMap })
  const report = reports.create('html')

  // @ts-ignore
  report.execute(context)
}

export const test: TTask<string, any> = async function* (pkg = 'iterama') {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  // const { mapThreadPool } = await import('@start/thread-pool')

  yield* pipe(
    find('coverage/'),
    remove,
    find(`packages/${pkg}/test_/*.{ts,tsx}`),
    testIt()
    // mapThreadPool(testIt, null)
  )()
}

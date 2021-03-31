import type { TGlobal, TPlugin, TTask } from './types'

const testIt = (): TPlugin<string, string> => async function* (it) {
  const { fileURLToPath } = await import('url')
  const { drainAsync, mapAsync } = await import('iterama')
  const { piAll } = await import('piall')
  const { CoverageInstrumenter } = await import('collect-v8-coverage')
  const { default: v8toIstanbul } = await import('v8-to-istanbul')
  const { default: { createCoverageMap } } = await import('istanbul-lib-coverage')
  const { default: { createContext } } = await import('istanbul-lib-report')
  const reports = await import('istanbul-reports')

  const instrumenter = new CoverageInstrumenter()
  const coverageMap = createCoverageMap()
  const piAlled = piAll(8)

  await instrumenter.startInstrumenting()

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
  const globl = global as any as TGlobal

  for (const coverage of coverages) {
    if (coverage.url.includes('iterama/src/concat.ts')) {
      const sourcemap = globl['@@start-source-maps'][coverage.url]
      const converter = v8toIstanbul(fileURLToPath(coverage.url), 0, {
        source: '',
        originalSource: '',
        sourceMap: { sourcemap },
      })

      await converter.load()

      converter.applyCoverage(coverage.functions)
      coverageMap.merge(converter.toIstanbul())
    }
  }

  const context = createContext({
    dir: 'coverage/',
    coverageMap,
  })

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
    find('cov/'),
    remove,
    find(`packages/${pkg}/test_/*.{ts,tsx}`),
    testIt()
    // mapThreadPool(testIt, null)
  )()
}

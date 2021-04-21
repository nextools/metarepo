import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { TTask } from './types'

export const test: TTask<string, CoverageMapData> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { mapThreadPool } = await import('@start/thread-pool')
  const { test, reportCoverage } = await import('./plugin-test')

  yield* pipe(
    find('coverage/'),
    remove,
    find([
      `packages/${pkg}/test_/**/*.{ts,tsx}`,
      `!packages/${pkg}/test_/fixtures/**`,
    ]),
    // test(),
    mapThreadPool(test, []),
    reportCoverage('coverage/', ['html', 'lcov'])
  )()
}

export const watchTest: TTask<string, CoverageMapData> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { watch } = await import('./plugin-watch')
  const { remove } = await import('./plugin-remove')
  const { test, reportCoverage } = await import('./plugin-test')

  yield* pipe(
    find('coverage/'),
    remove,
    watch([
      `packages/${pkg}/test_/**/*.{ts,tsx}`,
      `!packages/${pkg}/test_/fixtures/**`,
    ]),
    test(),
    reportCoverage('coverage/')
  )()
}

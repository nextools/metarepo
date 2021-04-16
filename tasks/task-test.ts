import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { TTask } from './types'

export const test: TTask<string, CoverageMapData> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { mapThreadPool } = await import('@start/thread-pool')
  const { log } = await import('./plugin-log')
  const { test, reportCoverage } = await import('./plugin-test')

  yield* pipe(
    find('coverage/'),
    remove,
    find([
      `packages/${pkg}/test_/**/*.{ts,tsx}`,
      `!packages/${pkg}/test)_/fixtures/`,
    ]),
    // test(),
    mapThreadPool(test, []),
    reportCoverage('coverage/', ['html', 'lcov']),
    log('tested')
  )()
}

export const wtest: TTask<string, CoverageMapData> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { watch } = await import('./plugin-watch')
  const { remove } = await import('./plugin-remove')
  // const { mapThreadPool } = await import('@start/thread-pool')
  const { log } = await import('./plugin-log')
  const { test, reportCoverage } = await import('./plugin-test')

  yield* pipe(
    find('coverage/'),
    remove,
    watch(`packages/${pkg}/test_/`),
    test(),
    // mapThreadPool(test, null),
    reportCoverage('coverage/'),
    log('tested')
  )()
}

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
    find(`packages/${pkg}/test_/**/*.{ts,tsx}`),
    // testIt(),
    mapThreadPool(test, null),
    reportCoverage('coverage/'),
    log('tested')
  )()
}

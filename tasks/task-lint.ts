import type { ESLint } from 'eslint'
import type { TTask } from './types'

export const lint: TTask<string, ESLint.LintResult> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { eslintCheck, eslintPrint } = await import('./plugin-lib-eslint')
  const { log } = await import('./plugin-log')
  const { mapThreadPool } = await import('@start/thread-pool')

  const files = '*.{ts,tsx,js,jsx,mjs}'

  yield* pipe(
    find([
      `packages/${pkg}/**/{src,test}/**/${files}`,
      `packages/${pkg}/${files}`,
      `tasks/**/${files}`,
      `!**/node_modules/**`,
    ]),
    // eslintCheck()
    mapThreadPool(eslintCheck, {}, { groupBy: 50 }),
    eslintPrint(),
    log('linted')
  )()
}

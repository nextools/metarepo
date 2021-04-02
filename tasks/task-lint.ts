import type { ESLint } from 'eslint'
import type { TTask } from './types'

export const lint: TTask<string, ESLint.LintResult> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { eslintCheck, eslintPrint } = await import('./plugin-lib-eslint')
  const { mapThreadPool } = await import('@start/thread-pool')

  const files = '*.{ts,tsx,js,jsx,mjs}'

  yield* pipe(
    find([
      `packages/${pkg}/**/{src,test}/**/${files}`,
      `packages/${pkg}/${files}`,
      `!packages/${pkg}/**/node_modules/`,
      `tasks/**/${files}`,
    ]),
    // eslint()
    mapThreadPool(eslintCheck, null, { groupBy: 50 }),
    eslintPrint()
  )()
}

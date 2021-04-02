import type { ESLint } from 'eslint'
import type { TPlugin, TTask } from './types'

const lintIt = (): TPlugin<string, ESLint.LintResult> => async function* (it) {
  const { read } = await import('./read')
  const { eslintCheck } = await import('./eslint')
  const { pipe } = await import('funcom')

  yield* pipe(
    read,
    eslintCheck()
  )(it)
}

export const lint: TTask<string, ESLint.LintResult> = async function* (pkg = '*') {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { eslintPrint } = await import('./eslint')
  const { mapThreadPool } = await import('@start/thread-pool')

  const files = '*.{ts,tsx,js,jsx,mjs}'

  yield* pipe(
    find([
      `packages/${pkg}/**/{src,test}/**/${files}`,
      `packages/${pkg}/${files}`,
      `!packages/${pkg}/**/node_modules/`,
      `tasks/**/${files}`,
    ]),
    // lintIt(),
    mapThreadPool(lintIt, null, { groupBy: 50 }),
    eslintPrint()
  )()
}

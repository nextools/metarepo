import type { ESLint } from 'eslint'
import type { TFile, TPlugin } from './types'

export const eslintCheck = (options?: ESLint.Options): TPlugin<string, ESLint.LintResult> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { pipe } = await import('funcom')
  const { filterAsync, mapAsync, ungroupAsync } = await import('iterama')
  const { read } = await import('./plugin-read')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })

  yield* pipe(
    filterAsync(async (path: string) => {
      const isPathIgnored = await eslint.isPathIgnored(path)

      return !isPathIgnored
    }),
    read,
    mapAsync(async (file: TFile) => {
      const results = await eslint.lintText(file.data, { filePath: file.path })

      if (options?.fix === true) {
        await ESLint.outputFixes(results)
      }

      return results
    }),
    ungroupAsync
  )(it)
}

export const eslintPrint = (options?: ESLint.Options): TPlugin<ESLint.LintResult, ESLint.LintResult> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { pipe } = await import('funcom')
  const { forEachAsync, finallyAsync } = await import('iterama')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })
  let hasErrors = false
  let hasWarnings = false
  const results: ESLint.LintResult[] = []

  yield* pipe(
    forEachAsync((result: ESLint.LintResult) => {
      hasErrors = hasErrors || result.errorCount > 0
      hasWarnings = hasWarnings || result.warningCount > 0

      results.push(result)
    }),
    finallyAsync(async () => {
      const formatter = await eslint.loadFormatter()
      const formattedReport = formatter.format(results)

      if (hasErrors || hasWarnings) {
        console.log(formattedReport)

        throw null
      }
    })
  )(it)
}

export const eslint = (options?: ESLint.Options): TPlugin<string, ESLint.LintResult> => async function* (it) {
  const { pipe } = await import('funcom')

  yield* pipe(
    eslintCheck(options),
    eslintPrint(options)
  )(it)
}

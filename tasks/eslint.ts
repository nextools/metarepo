import type { ESLint } from 'eslint'
import type { TFile, TPlugin } from './types'

export const eslintCheck = (options?: ESLint.Options): TPlugin<TFile, ESLint.LintResult[]> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { mapAsync } = await import('iterama')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })

  yield* mapAsync(async (file: TFile) => {
    const results = await eslint.lintText(file.data, { filePath: file.path })

    return results
  })(it)
}

export const eslintPrint = (options?: ESLint.Options): TPlugin<ESLint.LintResult[], ESLint.LintResult[]> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { forEachAsync } = await import('iterama')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })
  let hasErrors = false
  let hasWarnings = false
  const totalResults: ESLint.LintResult[] = []

  try {
    yield* forEachAsync((results: ESLint.LintResult[]) => {
      hasErrors = hasErrors || results.some((result) => result.errorCount > 0)
      hasWarnings = hasWarnings || results.some((result) => result.warningCount > 0)

      totalResults.push(...results)
    })(it)
  } finally {
    const formatter = await eslint.loadFormatter()
    const formattedReport = formatter.format(totalResults)

    if (hasErrors || hasWarnings) {
      console.log(formattedReport)
    }
  }
}

export const eslint = (options?: ESLint.Options): TPlugin<TFile, ESLint.LintResult[]> => async function* (it) {
  const { pipe } = await import('funcom')

  yield* pipe(
    eslintCheck(options),
    eslintPrint(options)
  )(it)
}

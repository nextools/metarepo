import type { ESLint } from 'eslint'
import type { TFile, TPlugin } from './types'

export const eslintCheck = (): TPlugin<TFile, ESLint.LintResult[]> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { mapAsync } = await import('iterama')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
  })

  yield* mapAsync(async (file: TFile) => {
    const results = await eslint.lintText(file.data, { filePath: file.path })

    return results
  })(it)
}

export const eslintPrint = (): TPlugin<ESLint.LintResult[], ESLint.LintResult[]> => async function* (it) {
  const { ESLint } = await import('eslint')
  const { forEachAsync } = await import('iterama')

  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
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

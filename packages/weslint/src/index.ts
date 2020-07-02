import { cpus } from 'os'
import { ESLint } from 'eslint'
import { workerama } from 'workerama'

export type TWeslintOptions = {
  files: string[],
  maxThreadCount?: number,
  formatter?: string,
  eslint?: ESLint.Options,
}

export type TWeslintResult = {
  hasErrors: boolean,
  hasWarnings: boolean,
  formattedReport: string,
}

type TReport = {
  results: ESLint.LintResult[],
  hasErrors: boolean,
  hasWarnings: boolean,
}

export const weslint = async (userOptions: TWeslintOptions): Promise<TWeslintResult> => {
  const options = {
    maxThreadCount: cpus().length,
    ...userOptions,
    eslint: {
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
      ...userOptions.eslint,
    },
  }
  const eslint = new ESLint(options.eslint)
  const filesToCheck = await options.files.reduce(async (accPromise, file) => {
    const isIgnored = await eslint.isPathIgnored(file)
    const acc = await accPromise

    if (!isIgnored) {
      acc.push(file)
    }

    return acc
  }, Promise.resolve<string[]>([]))
  const formatter = await eslint.loadFormatter(options.formatter)

  const reportsIterable = workerama<TReport>({
    items: filesToCheck,
    maxThreadCount: options.maxThreadCount,
    fnFilePath: './run-eslint',
    fnName: 'run',
    fnArgs: [options.eslint],
  })

  let hasErrors = false
  let hasWarnings = false
  const totalResults = [] as ESLint.LintResult[]

  for await (const report of reportsIterable) {
    hasErrors = hasErrors || report.hasErrors
    hasWarnings = hasWarnings || report.hasWarnings

    totalResults.push(...report.results)
  }

  const formattedReport = formatter.format(totalResults)

  return {
    hasErrors,
    hasWarnings,
    formattedReport,
  }
}

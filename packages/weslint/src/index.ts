import { cpus } from 'os'
import { workerama } from 'workerama'
import { CLIEngine } from 'eslint'

export type TWeslintOptions = {
  files: string[],
  maxThreadCount?: number,
  filesPerThreadCount?: number,
  formatter?: string,
  eslint?: CLIEngine.Options,
}

export type TWeslintResult = {
  hasErrors: boolean,
  hasWarnings: boolean,
  formattedReport: string,
}

export const weslint = async (userOptions: TWeslintOptions): Promise<TWeslintResult> => {
  const options = {
    maxThreadCount: cpus().length,
    filesPerThreadCount: 5,
    ...userOptions,
    eslint: {
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
      ...userOptions.eslint,
    },
  }
  const cli = new CLIEngine(options.eslint)
  const reports = [] as CLIEngine.LintReport[]

  await workerama({
    items: options.files,
    itemsPerThreadCount: options.filesPerThreadCount,
    maxThreadCount: options.maxThreadCount,
    fnFilePath: './run-eslint',
    fnName: 'run',
    fnArgs: [options],
    onItemResult: (report) => {
      reports.push(report)
    },
  })

  const result: CLIEngine.LintReport = reports.reduce((acc, report) => {
    for (const result of report.results) {
      acc.results.push(result)
      acc.errorCount += result.errorCount
      acc.warningCount += result.warningCount
      acc.fixableErrorCount += result.fixableErrorCount
      acc.fixableWarningCount += result.fixableWarningCount
    }

    acc.usedDeprecatedRules.push(...report.usedDeprecatedRules)

    return acc
  }, {
    results: [] as CLIEngine.LintResult[],
    errorCount: 0,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    usedDeprecatedRules: [] as CLIEngine.DeprecatedRuleUse[],
  })

  const format = cli.getFormatter(options.formatter)

  return {
    hasErrors: result.errorCount > 0,
    hasWarnings: result.warningCount > 0,
    formattedReport: format(result.results),
  }
}

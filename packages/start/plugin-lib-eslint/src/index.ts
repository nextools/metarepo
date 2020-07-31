import plugin from '@start/plugin'
import type { StartDataFilesProps, StartDataFile } from '@start/plugin'
import { ESLint } from 'eslint'

export default (userOptions?: ESLint.Options, formatterName = '') =>
  plugin('eslint', ({ logMessage, logPath }) => async ({ files }: StartDataFilesProps) => {
    const { ESLint } = await import('eslint')
    const options: ESLint.Options = {
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
      ...userOptions,
    }

    const eslint = new ESLint(options)
    const formatter = await eslint.loadFormatter(formatterName)
    const filesToCheck = await files.reduce(async (resPromise, file) => {
      const isIgnored = await eslint.isPathIgnored(file.path)
      const res = await resPromise

      if (!isIgnored) {
        res.push(file)
      }

      return res
    }, Promise.resolve<StartDataFile[]>([]))
    const fixedFiles = [] as StartDataFile[]
    const totalResults = [] as ESLint.LintResult[]
    let hasErrors = false
    let hasWarnings = false

    for (const file of filesToCheck) {
      const results = await eslint.lintText(file.data, { filePath: file.path })

      hasErrors = hasErrors || results.some((result) => result.errorCount > 0)
      hasWarnings = hasWarnings || results.some((result) => result.warningCount > 0)

      totalResults.push(...results)

      if (options.fix) {
        for (const result of results) {
          if (typeof result.output === 'string') {
            fixedFiles.push({
              path: result.filePath,
              data: result.output,
            })

            logPath(result.filePath)
          }
        }
      }
    }

    if (hasErrors || hasWarnings) {
      console.log(formatter.format(totalResults))
    }

    if (!options.fix && hasErrors) {
      throw null
    }

    if (options.fix) {
      if (fixedFiles.length === 0) {
        logMessage('¯\\_(ツ)_/¯')
      }

      return {
        files: fixedFiles,
      }
    }

    if (!hasErrors && !hasWarnings) {
      logMessage('¯\\_(ツ)_/¯')
    }
  })

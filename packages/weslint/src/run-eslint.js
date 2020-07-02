const fs = require('fs')
const { promisify } = require('util')
const { ESLint } = require('eslint')

const readFile = promisify(fs.readFile)

exports.run = (options) => {
  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })

  return async (item) => {
    if (!item.done) {
      const data = await readFile(item.value, 'utf8')
      const results = await eslint.lintText(data, { filePath: item.value })
      const hasErrors = results.some((result) => result.errorCount > 0)
      const hasWarnings = results.some((result) => result.warningCount > 0)

      return {
        value: {
          results,
          hasErrors,
          hasWarnings,
        },
      }
    }
  }
}

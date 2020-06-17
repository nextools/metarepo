const fs = require('fs')
const { promisify } = require('util')
const { CLIEngine } = require('eslint')

const readFile = promisify(fs.readFile)

exports.run = (options) => {
  const cli = new CLIEngine({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    ...options,
  })

  return async (item) => {
    if (!item.done) {
      const data = await readFile(item.value, 'utf8')
      const report = cli.executeOnText(data, item.value)

      return { value: report }
    }
  }
}

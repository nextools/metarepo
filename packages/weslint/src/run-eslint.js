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

  return async (file) => {
    const data = await readFile(file, 'utf8')
    const report = cli.executeOnText(data, file)

    return { value: report }
  }
}

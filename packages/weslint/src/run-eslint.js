const { promises: { readFile } } = require('fs')
const { CLIEngine } = require('eslint')

let cli = null

exports.run = async (file, options) => {
  if (cli === null) {
    cli = new CLIEngine({
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
      ...options,
    })
  }

  const data = await readFile(file, 'utf8')
  const report = cli.executeOnText(data, file)

  return report
}

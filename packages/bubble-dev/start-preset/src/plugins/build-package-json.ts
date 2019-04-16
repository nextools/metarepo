import plugin from '@start/plugin'

export default (dir: string) =>
  plugin('buildPackageJson', ({ logPath }) => async () => {
    const { resolve } = await import('path')
    const { promisify } = await import('util')
    const { readFile, writeFile } = await import('graceful-fs')

    const pReadFile = promisify(readFile)
    const pWriteFile = promisify(writeFile)
    const packageJsonPath = resolve(dir, 'package.json')

    const packageJson = JSON.parse(await pReadFile(packageJsonPath, 'utf8'))
    const newPackageJsonPath = resolve(dir, 'build/package.json')
    const newPackageJson = Object.entries(packageJson).reduce((result, [key, value]) => {
      if (key === 'devDependencies' || key === 'files') {
        return result
      }

      if (key === 'main') {
        result[key] = 'node/index.js'
      } else if (key === 'browser') {
        result[key] = 'web/index.js'
      } else if (key === 'react-native') {
        result[key] = 'native/index.js'
      } else {
        result[key] = value
      }

      return result
    }, {} as { [key: string]: any })

    await pWriteFile(newPackageJsonPath, JSON.stringify(newPackageJson, null, 2))

    logPath(newPackageJsonPath)
  })

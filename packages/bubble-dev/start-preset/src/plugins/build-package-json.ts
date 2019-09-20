import plugin from '@start/plugin'
import { TJsonMap } from 'typeon'

export default (dir: string) =>
  plugin('buildPackageJson', ({ logPath }) => async () => {
    const { resolve } = await import('path')
    const { readFile, writeFile } = await import('pifs')
    const packageJsonPath = resolve(dir, 'package.json')

    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as TJsonMap
    const newPackageJsonPath = resolve(dir, 'build/package.json')
    const newPackageJson = Object.entries(packageJson).reduce((result, [key, value]) => {
      if (key === 'devDependencies' || key === 'files' || key === 'buildAssets') {
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

      if (key === 'bin') {
        result[key] = Object.entries(value as TJsonMap).reduce((bins, [binKey, binValue]) => {
          if (typeof binValue === 'string') {
            bins[binKey] = binValue.replace('src/', 'node/').replace('.ts', '.js')
          }

          return bins
        }, {} as TJsonMap)
      }

      return result
    }, {} as TJsonMap)

    await writeFile(newPackageJsonPath, JSON.stringify(newPackageJson, null, 2))

    logPath(newPackageJsonPath)
  })

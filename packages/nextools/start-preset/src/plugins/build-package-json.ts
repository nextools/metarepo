import plugin from '@start/plugin'
import type { TJsonMap } from 'typeon'

export default (dir: string) =>
  plugin('buildPackageJson', ({ logPath }) => async () => {
    const { resolve } = await import('path')
    const { readFile, writeFile } = await import('pifs')
    const packageJsonPath = resolve(dir, 'package.json')

    const packageJson: TJsonMap = JSON.parse(await readFile(packageJsonPath, 'utf8'))
    const newPackageJsonPath = resolve(dir, 'build/package.json')
    const newPackageJson = Object.entries(packageJson).reduce((result, [key, value]) => {
      switch (key) {
        case 'devDependencies':
        case 'files':
        case 'buildAssets': {
          break
        }
        case 'main': {
          if (!Reflect.has(packageJson, 'types')) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'node/index.js'

          break
        }
        case 'browser': {
          if (!Reflect.has(packageJson, 'types')) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'web/index.js'

          break
        }
        case 'react-native': {
          if (!Reflect.has(packageJson, 'types')) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'native/index.js'

          break
        }
        case 'bin': {
          result[key] = Object.entries(value as TJsonMap).reduce((bins, [binKey, binValue]) => {
            if (typeof binValue === 'string') {
              bins[binKey] = binValue.replace('src/', 'node/').replace('.ts', '.js')
            }

            return bins
          }, {} as TJsonMap)

          break
        }
        default: {
          result[key] = value
        }
      }

      return result
    }, {} as TJsonMap)

    await writeFile(newPackageJsonPath, JSON.stringify(newPackageJson, null, 2))

    logPath(newPackageJsonPath)
  })

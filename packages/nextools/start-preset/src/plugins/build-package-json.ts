import plugin from '@start/plugin'
import type { TPackageJson } from 'pkgu'
import type { TAnyObject, TRequireKeys } from 'tsfn'
import { isString } from 'tsfn'
import type { TAssets } from './copy-assets'

type TPackageJsonNextools = TPackageJson & {
  buildAssets: TAssets,
  fixdeps: TAnyObject,
}
type TPackageJsonBin = TRequireKeys<TPackageJson, 'bin'>['bin']

export const buildPackageJson = (dir: string) =>
  plugin('buildPackageJson', ({ logPath }) => async () => {
    const path = await import('path')
    const { writePackageJson, readPackageJson } = await import('pkgu')
    const { getObjectEntries, objectHas } = await import('tsfn')
    const { isFilePathTS } = await import('../utils')

    const packageJson = await readPackageJson(dir) as TPackageJsonNextools
    const newPackageJson = getObjectEntries(packageJson).reduce((result, [key, value]) => {
      switch (key) {
        case 'devDependencies':
        case 'files':
        case 'buildAssets':
        case 'fixdeps': {
          break
        }
        case 'main': {
          if (!objectHas(packageJson, 'types') && isFilePathTS(packageJson.main!)) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'node/index.js'

          break
        }
        case 'browser': {
          if (!objectHas(packageJson, 'types') && isFilePathTS(packageJson.browser!)) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'web/index.js'

          break
        }
        case 'react-native': {
          if (!objectHas(packageJson, 'types') && isFilePathTS(packageJson['react-native']!)) {
            result.types = 'types/index.d.ts'
          }

          result[key] = 'native/index.js'

          break
        }
        case 'types': {
          result.types = 'types/index.d.ts'

          break
        }
        case 'bin': {
          if (isString(value)) {
            result[key] = value.replace('src/', 'node/').replace('.ts', '.js')
          } else {
            result[key] = Object.entries(value as TPackageJsonBin).reduce((bins, [binKey, binValue]) => {
              bins[binKey] = binValue.replace('src/', 'node/').replace('.ts', '.js')

              return bins
            }, {} as TAnyObject)
          }

          break
        }
        default: {
          // @ts-ignore
          result[key] = value
        }
      }

      return result
    }, {} as TPackageJson)

    const publishDir = path.join(dir, 'build/')

    await writePackageJson(publishDir, newPackageJson)

    logPath(dir)
  })

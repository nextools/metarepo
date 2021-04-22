import type { TPlugin, TTask } from '@start/types'
import type { TPackageJson } from 'pkgu'
import type { TStringObject } from 'tsfn'

type TPackageJsonNextools = TPackageJson & {
  buildAssets: TStringObject,
  fixdeps: TStringObject,
}

const isFilePathTs = (filePath: string): boolean => filePath.endsWith('.ts') || filePath.endsWith('.tsx')

const preparePackageJson = (pkg: string): TPlugin<any, string> => async function* (it) {
  const { pipe } = await import('funcom')
  const { mapAsync } = await import('iterama')
  const { readFile, writeFile } = await import('fs/promises')
  const { jsonParse, jsonStringify } = await import('typeon')
  const { iterateObjectEntries } = await import('itobj')
  const { isString } = await import('tsfn')
  const { find } = await import('./plugin-find')
  const { copy } = await import('./plugin-copy')

  yield* pipe(
    find(`packages/${pkg}/package.json`),
    copy(`packages/${pkg}/build/`),
    mapAsync(async (filePath: string) => {
      const packageJsonData = await readFile(filePath, 'utf8')
      const packageJson = jsonParse<TPackageJsonNextools>(packageJsonData)
      const newPackageJson = {} as TPackageJsonNextools

      for (const [key, value] of iterateObjectEntries(packageJson)) {
        switch (key) {
          case 'devDependencies':
          case 'files':
          case 'buildAssets':
          case 'fixdeps': {
            break
          }
          case 'main': {
            if (isFilePathTs(packageJson.main!)) {
              newPackageJson.types = 'types/index.d.ts'
            }

            newPackageJson[key] = 'node/index.js'

            break
          }
          case 'browser': {
            if (isFilePathTs(packageJson.browser!)) {
              newPackageJson.types = 'types/index.d.ts'
            }

            newPackageJson[key] = 'web/index.js'

            break
          }
          case 'react-native': {
            if (isFilePathTs(packageJson['react-native']!)) {
              newPackageJson.types = 'types/index.d.ts'
            }

            newPackageJson[key] = 'native/index.js'

            break
          }
          case 'types': {
            newPackageJson.types = 'types/index.d.ts'

            break
          }
          case 'bin': {
            if (isString(value)) {
              newPackageJson[key] = value.replace('src/', 'node/').replace('.ts', '.js')
            } else {
              const binObj = {} as TStringObject

              for (const [exportKey, exportValue] of iterateObjectEntries(value as TStringObject)) {
                binObj[exportKey] = exportValue.replace('src/', 'node/').replace('.ts', '.js')
              }

              newPackageJson[key] = binObj
            }

            break
          }
          case 'exports': {
            const exportsObj = {} as TStringObject

            for (const [exportKey, exportValue] of iterateObjectEntries(value as TStringObject)) {
              exportsObj[exportKey] = exportValue.replace('src/', 'node/').replace('.ts', '.js')
            }

            newPackageJson[key] = exportsObj

            break
          }
          default: {
            // @ts-expect-error
            newPackageJson[key] = value
          }
        }
      }

      const newPackageJsonData = `${jsonStringify(newPackageJson, 2)}\n`

      await writeFile(filePath, newPackageJsonData)

      return filePath
    })
  )(it)
}

export const prepublish: TTask<string, string> = async function* (pkg) {
  const { isUndefined } = await import('tsfn')

  if (isUndefined(pkg)) {
    throw new Error('Package argument must be specified')
  }

  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { copy } = await import('./plugin-copy')
  const { log } = await import('./plugin-log')

  yield* pipe(
    find(`packages/${pkg}/{readme,license}.md`),
    copy(`packages/${pkg}/build/`),
    log('markdown files'),
    preparePackageJson(pkg),
    log('package.json')
  )()
}

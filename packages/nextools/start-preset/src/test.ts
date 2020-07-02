import plugin from '@start/plugin'
import env from '@start/plugin-env'
import find from '@start/plugin-find'
import { istanbulInstrument, istanbulReport } from '@start/plugin-lib-istanbul'
import tape from '@start/plugin-lib-tape'
import typescriptCheck from '@start/plugin-lib-typescript-check'
import remove from '@start/plugin-remove'
import sequence from '@start/plugin-sequence'
import { TPackageJson } from 'fixdeps'

export const checkDeps = () => plugin('checkDeps', ({ logMessage }) => async () => {
  const path = await import('path')
  const { objectHas } = await import('tsfn')
  const { hasDepsToModify } = await import('fixdeps')
  const { getPackage, getPackageDirs } = await import('@auto/fs')
  const packageDirs = await getPackageDirs()

  const fixPackageDir = async (dir: string): Promise<boolean> => {
    const json: TPackageJson = await getPackage(dir)
    let ignoredPackages: string[] = ['@babel/runtime']
    let dependenciesGlobs = ['src/**/*.{ts,tsx,js}']
    let devDependenciesGlobs = ['{test,x-ray}/**/*.{ts,tsx,js}', 'meta.{ts,tsx}']

    if (objectHas(json, 'fixdeps')) {
      const options = json.fixdeps

      if (objectHas(options, 'ignoredPackages')) {
        ignoredPackages = options.ignoredPackages
      }

      if (objectHas(options, 'dependenciesGlobs')) {
        dependenciesGlobs = options.dependenciesGlobs
      }

      if (objectHas(options, 'devDependenciesGlobs')) {
        devDependenciesGlobs = options.devDependenciesGlobs
      }
    }

    return hasDepsToModify({
      ignoredPackages,
      packagePath: dir,
      dependenciesGlobs,
      devDependenciesGlobs,
    })
  }

  for (const dir of Object.values(packageDirs)) {
    if (await fixPackageDir(dir)) {
      logMessage(`"${path.basename(dir)}" has unfixed dependencies`)
      throw null
    }
  }
})

export const lint = async () => {
  const { weslint } = await import('weslint')
  const path = await import('path')
  const packageJson = await import(path.resolve('package.json'))
  const globs = packageJson.workspaces.reduce((acc: string[], glob: string) => (
    acc.concat(
      `${glob}/{src,test,x-ray}/**/*.{ts,tsx}`,
      `${glob}/*.{ts,tsx}`
    )
  ), [] as string[])

  return sequence(
    find([
      ...globs,
      'tasks/**/*.ts',
    ]),
    plugin('weslint', ({ logMessage }) => async ({ files }) => {
      const result = await weslint({
        files: files.map((file) => file.path),
      })

      if (result.hasErrors || result.hasWarnings) {
        console.log(result.formattedReport)
      } else {
        logMessage('¯\\_(ツ)_/¯')
      }

      if (result.hasErrors) {
        throw null
      }
    }),
    typescriptCheck()
  )
}

export const test = async (packageDir: string = '**') => {
  // @ts-ignore
  const { default: tapDiff } = await import('tap-diff')

  return sequence(
    env({ NODE_ENV: 'test' }),
    find(`coverage/`),
    remove,
    find(`packages/${packageDir}/src/**/*.{ts,tsx}`),
    istanbulInstrument(['.ts', '.tsx']),
    find([
      `packages/${packageDir}/test/**/*.{ts,tsx}`,
      `!packages/${packageDir}/test/fixtures`,
    ]),
    tape(tapDiff),
    istanbulReport(['lcovonly', 'html', 'text-summary'])
  )
}

export const ci = () =>
  sequence(
    lint(),
    test(),
    checkDeps()
  )

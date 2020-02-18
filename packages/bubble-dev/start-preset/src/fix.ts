import plugin from '@start/plugin'
import overwrite from '@start/plugin-overwrite'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import eslint from '@start/plugin-lib-eslint'
import { TPackageJson } from 'fixdeps'

export const fixLint = async () => {
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
    read,
    eslint({
      fix: true,
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    overwrite
  )
}

export const fixDeps = (packageDir?: string) => plugin('fixDeps', ({ logPath, logMessage }) => async () => {
  const { fixdeps } = await import('fixdeps')
  const { objectHas, isDefined } = await import('tsfn')
  const { getPackage, getPackageDirs } = await import('@auto/fs')
  const packageDirs = await getPackageDirs()

  const fixPackageDir = async (dir: string) => {
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

    try {
      const result = await fixdeps({
        ignoredPackages,
        packagePath: dir,
        dependenciesGlobs,
        devDependenciesGlobs,
      })

      if (result !== null) {
        logPath(`${json.name}:`)

        const addedDeps = Object.keys(result.addedDeps)
        const addedDevDeps = Object.keys(result.addedDevDeps)

        if (addedDeps.length > 0) {
          logMessage(`+ added deps: ${addedDeps.join(', ')}`)
        }

        if (addedDevDeps.length > 0) {
          logMessage(`+ added devDeps: ${addedDevDeps.join(', ')}`)
        }

        if (result.removedDeps.length > 0) {
          logMessage(`- removed deps: ${result.removedDeps.join(', ')}`)
        }
      }
    } catch (e) {
      logMessage(`${json.name}:`)
      logMessage(`  error: ${e.message}`)
    }
  }

  if (isDefined(packageDir)) {
    const path = await import('path')
    const resolvedPackageDir = path.resolve(`packages/${packageDir}`)

    if (!packageDirs.includes(resolvedPackageDir)) {
      throw new Error(`Cannot find package in dir "${packageDir}"`)
    }

    await fixPackageDir(resolvedPackageDir)
  } else {
    for (const dir of Object.values(packageDirs)) {
      await fixPackageDir(dir)
    }
  }
})

import path from 'path'
import { promisify } from 'util'
import { getPackageDirs, getPackage } from '@auto/fs'
import { readFile, writeFile } from 'graceful-fs'
import globby from 'globby'
import { TDepsEntries, TOptions } from './types'
import { entriesIncludes, objectFromEntries, getDepsToRemove, globalIgnoreList } from './utils'
import { getDependenciesInContent } from './get-dependencies-in-content'
import { getPackageVersionNpm } from './get-package-version-npm'
import { getLocalPackageVersionYarn } from './get-local-package-version-yarn'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export const fixdeps = async (options: TOptions) => {
  const logPath = options.logPath || (() => {})
  const logMessage = options.logMessage || (() => {})

  const allPackagesDirs = await getPackageDirs()
  const packagesDirs = allPackagesDirs.filter(options.workspacePackagesFilter)
  const globbyOptions = {
    ignore: ['node_modules/**'],
    deep: true,
    onlyFiles: false,
    expandDirectories: false,
    absolute: true,
  }
  const packagesChanged: string[] = []
  const cachedVersions = new Map<string, string>()

  for (const dir of packagesDirs) {
    const packageJsonPath = path.join(dir, 'package.json')
    const packageJson = await getPackage(dir)
    const filenamesForAdd = await globby(`${dir}/src/**/*.{ts,tsx}`, globbyOptions)
    const filenamesForRemove = await globby(`${dir}/**/*.{ts,tsx}`, globbyOptions)
    const ignoredPackages = Array.isArray(options.ignoredPackages)
      ? globalIgnoreList.concat(options.ignoredPackages)
      : globalIgnoreList

    const depsFromSources: string[] = []
    const depsFromEverywhere: string[] = []

    logPath(dir)

    for (const filename of filenamesForRemove) {
      const fileContent = await pReadFile(filename, { encoding: 'utf8' })

      try {
        getDependenciesInContent(fileContent).forEach((dep) => {
          if (!depsFromEverywhere.includes(dep)) {
            depsFromEverywhere.push(dep)

            if (filenamesForAdd.includes(filename)) {
              depsFromSources.push(dep)
            }
          }
        })
      } catch (e) {
        logMessage(e)
      }
    }

    // ENTRIES
    let packageDepEntries: TDepsEntries = []

    if (packageJson.dependencies) {
      packageDepEntries = Object.entries(packageJson.dependencies)
    }

    let packageDevDepEntries: TDepsEntries = []

    if (packageJson.devDependencies) {
      packageDevDepEntries = Object.entries(packageJson.devDependencies)
    }

    let packagePeerEntries: TDepsEntries = []

    if (packageJson.peerDependencies) {
      packagePeerEntries = Object.entries(packageJson.peerDependencies)
    }

    // Remove unused deps
    let removedDeps: string[] = []

    if (packageJson.dependencies) {
      removedDeps = getDepsToRemove(packageDepEntries, depsFromEverywhere, ignoredPackages)
    }

    let removedDevDeps: string[] = []

    if (packageJson.devDependencies) {
      removedDevDeps = getDepsToRemove(packageDevDepEntries, depsFromEverywhere, ignoredPackages)
    }

    const addedDeps: TDepsEntries = []
    const missingDepsInSources = depsFromSources.filter((dep) => {
      return !ignoredPackages.includes(dep) &&
        !entriesIncludes(packageDepEntries, dep) &&
        !entriesIncludes(packageDevDepEntries, dep) &&
        !entriesIncludes(packagePeerEntries, dep)
    })

    for (const missingDep of missingDepsInSources) {
      logMessage(`requesting local version of ${missingDep}`)

      let yarnVersion: string | null = null

      if (cachedVersions.has(missingDep)) {
        yarnVersion = cachedVersions.get(missingDep)!
      } else {
        yarnVersion = await getLocalPackageVersionYarn(missingDep)

        if (yarnVersion !== null) {
          cachedVersions.set(missingDep, yarnVersion)
        }
      }

      if (yarnVersion !== null) {
        addedDeps.push([missingDep, `^${yarnVersion}`])

        continue
      }

      logMessage(`requesting npm version of ${missingDep}`)

      const npmVersion = await getPackageVersionNpm(missingDep)

      cachedVersions.set(missingDep, npmVersion)
      addedDeps.push([missingDep, `^${npmVersion}`])
    }

    if (removedDeps.length > 0 || addedDeps.length > 0) {
      packageJson.dependencies = objectFromEntries(
        packageDepEntries
          .filter(([name]) => !removedDeps.includes(name))
          .concat(addedDeps)
      )
    }

    if (removedDevDeps.length > 0) {
      packageJson.devDependencies = objectFromEntries(
        packageDevDepEntries
          .filter(([name]) => {
            if (name.startsWith('@types/')) {
              const baseName = name.substr(7)

              if (removedDeps.includes(baseName) || removedDevDeps.includes(baseName)) {
                return true
              }

              if (
                entriesIncludes(packageDepEntries, baseName) ||
                entriesIncludes(packageDevDepEntries, baseName) ||
                entriesIncludes(packagePeerEntries, baseName) ||
                entriesIncludes(addedDeps, baseName)
              ) {
                return false
              }
            }

            return !removedDevDeps.includes(name)
          })
      )
    }

    if (removedDeps.length > 0 || addedDeps.length > 0) {
      const packageData = `${JSON.stringify(packageJson, null, 2)}\n`
      await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })

      packagesChanged.push(dir)
    }
  }

  // run yarn install
  // if (packagesChanged.length > 0) {
  //   await runYarnInstall()
  // }
}

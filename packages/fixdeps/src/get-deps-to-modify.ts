import Module from 'module'
import fastGlob from 'fast-glob'
import { readFile } from 'pifs'
import { getDependenciesInContent } from './get-dependencies-in-content'
import { getDepsToAdd } from './get-deps-to-add'
import { getDepsToRemove } from './get-deps-to-remove'
import { getPackage } from './get-package-json'
import { getPeerDevDepsToAdd } from './get-peer-dev-deps-to-add'
import type { TOptions, TGetDepsToModifyResult } from './types'
import { uniqueArray } from './unique-array'

export const getDepsToModify = async ({
  packagePath,
  ignoredPackages,
  dependenciesGlobs,
  devDependenciesGlobs,
}: TOptions): Promise<TGetDepsToModifyResult> => {
  const fastGlobOptions = {
    ignore: ['node_modules/**'],
    deep: Infinity,
    onlyFiles: false,
    expandDirectories: false,
    absolute: true,
  }

  const packageJson = await getPackage(packagePath)
  const dependencyFiles = await fastGlob(
    dependenciesGlobs.map((glob) => `${packagePath}/${glob}`),
    fastGlobOptions
  )
  const devDependencyFiles = await fastGlob(
    devDependenciesGlobs.map((glob) => {
      if (glob.startsWith('!')) {
        return `!${packagePath}/${glob.substr(1)}`
      }

      return `${packagePath}/${glob}`
    }),
    fastGlobOptions
  )
  const allFiles = uniqueArray([...dependencyFiles, ...devDependencyFiles])
  const allIgnoredPackages = Array.isArray(ignoredPackages)
    ? Module.builtinModules.concat(ignoredPackages)
    : Module.builtinModules

  const dependencyList: string[] = []
  const devDependencyList: string[] = []

  for (const filename of allFiles) {
    const fileContent = await readFile(filename, 'utf8')

    getDependenciesInContent(fileContent).forEach((dep) => {
      if (dependencyFiles.includes(filename)) {
        dependencyList.push(dep)
      } else /* if (devDependencyFiles.includes(filename)) */ {
        devDependencyList.push(dep)
      }
    })
  }

  const depsToRemove = getDepsToRemove(packageJson, [...dependencyList, ...devDependencyList], allIgnoredPackages)
  const depsToAdd = getDepsToAdd(packageJson, dependencyList, allIgnoredPackages)
  const devDepsToAdd = getDepsToAdd(packageJson, devDependencyList, allIgnoredPackages)
  const peerDevDepsToAdd = getPeerDevDepsToAdd(packageJson, devDependencyList, allIgnoredPackages)

  return {
    depsToAdd,
    depsToRemove,
    devDepsToAdd,
    peerDevDepsToAdd,
  }
}

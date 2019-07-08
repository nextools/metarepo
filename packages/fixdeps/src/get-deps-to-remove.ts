import { isUndefined } from 'tsfn'
import { uniqueArray } from './unique-array'
import { TPackageJson } from './types'

export const getDepsToRemove = (packageJson: TPackageJson, depsFoundInFiles: string[], ignoredDeps: string[]): string[] => {
  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const peerDependenciesKeys = !isUndefined(packageJson.peerDependencies)
    ? Object.keys(packageJson.peerDependencies)
    : []
  const allDepsKeys = uniqueArray([...dependenciesKeys, ...devDependenciesKeys])
  const removedDeps: string[] = []

  for (const name of allDepsKeys) {
    let baseName = name

    if (name.startsWith('@types/')) {
      baseName = name.substr(7)

      if (baseName.includes('__')) {
        baseName = `@${baseName.replace('__', '/')}`
      }
    }

    if (!ignoredDeps.includes(baseName) && !depsFoundInFiles.includes(baseName) && !peerDependenciesKeys.includes(baseName)) {
      removedDeps.push(name)
    }
  }

  return removedDeps
}

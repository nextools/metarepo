import { isUndefined } from 'tsfn'
import { TPackageJson } from './types'

export const getDepsToAdd = (packageJson: TPackageJson, depNames: string[], ignoredPackages: string[]): string[] => {
  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const peerDependenciesKeys = !isUndefined(packageJson.peerDependencies)
    ? Object.keys(packageJson.peerDependencies)
    : []

  return depNames.filter((name) => (
    !ignoredPackages.includes(name) &&
    !dependenciesKeys.includes(name) &&
    !devDependenciesKeys.includes(name) &&
    !peerDependenciesKeys.includes(name)
  ))
}

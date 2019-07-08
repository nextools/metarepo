import { isUndefined } from 'tsfn'
import { TPackageJson } from './types'

export const getPeerDevDepsToAdd = (packageJson: TPackageJson, depNames: string[], ignoredPackages: string[]): string[] => {
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const peerDependenciesKeys = !isUndefined(packageJson.peerDependencies)
    ? Object.keys(packageJson.peerDependencies)
    : []

  return peerDependenciesKeys.filter((name) =>
    !depNames.includes(name) &&
    !ignoredPackages.includes(name) &&
    !devDependenciesKeys.includes(name))
}

import { isDependencyObject, TPackageJson, TPackages } from '@auto/utils'
import { TCrossDependents } from './types'

const isDependent = (pkg: TPackageJson, dependsOnName: string): boolean => {
  let isDep = false

  if (isDependencyObject(pkg.dependencies)) {
    isDep = Reflect.has(pkg.dependencies, dependsOnName) || isDep
  }

  if (isDependencyObject(pkg.devDependencies)) {
    isDep = Reflect.has(pkg.devDependencies, dependsOnName) || isDep
  }

  return isDep
}

const getDependencyRange = ({ dependencies }: TPackageJson, name: string) =>
  (isDependencyObject(dependencies) && Reflect.has(dependencies, name)
    ? dependencies[name]
    : null)

const getDevDependencyRange = ({ devDependencies }: TPackageJson, name: string) =>
  (isDependencyObject(devDependencies) && Reflect.has(devDependencies, name)
    ? devDependencies[name]
    : null)

export const getCrossDependents = (packages: TPackages): TCrossDependents =>
  Object.keys(packages).reduce(
    (pkgs, name) => {
      const fullName = packages[name].json.name
      const dependentNames = Object.keys(packages)
        .filter((depName) => isDependent(packages[depName].json, fullName))

      if (dependentNames.length > 0) {
        pkgs[name] = dependentNames.map((depName) => ({
          name: depName,
          range: getDependencyRange(packages[depName].json, fullName),
          devRange: getDevDependencyRange(packages[depName].json, fullName),
        }))
      }

      return pkgs
    },
    {} as TCrossDependents
  )

import type { TReadonly } from 'tsfn'
import type { TPackageRelease } from '../types'

type TGetDependentCount = Pick<TPackageRelease, 'deps' | 'devDeps'>

export const getDependentsCount = (packageBump: TReadonly<TGetDependentCount>) => {
  let depsCount = 0

  if (packageBump.deps !== null) {
    depsCount = Object.keys(packageBump.deps).length
  }

  let devDepsCount = 0

  if (packageBump.devDeps !== null) {
    devDepsCount = Object.keys(packageBump.devDeps).length
  }

  return depsCount + devDepsCount
}

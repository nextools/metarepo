import { TPackageBump } from '@auto/utils'

export const getDependentsCount = (packageBump: TPackageBump) => {
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

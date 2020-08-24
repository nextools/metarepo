import pAll from 'p-all'
import { isDefined } from 'tsfn'
import type { TReadonly } from 'tsfn'
import type { TPackageRelease } from '../types'
import { readPackage } from './read-package'
import { writePackage } from './write-package'

type TPackageDependency = Pick<TPackageRelease, 'dir' | 'deps' | 'devDeps'>

const writePackageDependencies = async (pkg: TReadonly<TPackageDependency>): Promise<void> => {
  if (pkg.deps === null && pkg.devDeps === null) {
    return
  }

  const packageJson = await readPackage(pkg.dir)

  if (pkg.deps !== null && isDefined(packageJson.dependencies)) {
    for (const [depName, depRange] of Object.entries(pkg.deps)) {
      packageJson.dependencies[depName] = depRange
    }
  }

  if (pkg.devDeps !== null && isDefined(packageJson.devDependencies)) {
    for (const [depName, depRange] of Object.entries(pkg.devDeps)) {
      packageJson.devDependencies[depName] = depRange
    }
  }

  return writePackage(pkg.dir, packageJson)
}

export const writePackagesDependencies = async (packages: TReadonly<TPackageDependency[]>): Promise<void> => {
  await pAll(
    packages.map((pkg) => () => writePackageDependencies(pkg)),
    { concurrency: 4 }
  )
}

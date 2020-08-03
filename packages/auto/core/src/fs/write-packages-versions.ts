import pAll from 'p-all'
import type { TReadonly } from 'tsfn'
import type { TPackageRelease } from '../types'
import { readPackage } from './read-package'
import { writePackage } from './write-package'

type TPackageVersion = Pick<TPackageRelease, 'dir' | 'version'>

const writePackageVersion = async (pkg: TReadonly<TPackageVersion>): Promise<void> => {
  if (pkg.version === null) {
    return
  }

  const packageJson = await readPackage(pkg.dir)

  packageJson.version = pkg.version

  return writePackage(pkg.dir, packageJson)
}

export const writePackagesVersions = async (packageBumps: TReadonly<TPackageVersion[]>): Promise<void> => {
  await pAll(
    packageBumps.map((pkg) => () => writePackageVersion(pkg)),
    { concurrency: 4 }
  )
}

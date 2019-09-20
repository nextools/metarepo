import path from 'path'
import { writeFile } from 'pifs'
import { TPackageBump } from '@auto/utils'
import { getPackage } from './get-package'

export const writePackageVersions = async (packageBumps: TPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.version === null) {
      continue
    }

    const packageJsonPath = path.join(bump.dir, 'package.json')
    const packageJson = await getPackage(bump.dir)

    packageJson.version = bump.version

    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await writeFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}

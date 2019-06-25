import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'
import { TPackageBump } from '@auto/utils'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writePackageVersions = async (packageBumps: TPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.version === null) {
      continue
    }

    const packageJsonPath = path.join(bump.dir, 'package.json')
    const packageJson = await getPackage(bump.dir)

    packageJson.version = bump.version

    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}

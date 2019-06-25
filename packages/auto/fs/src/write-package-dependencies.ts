import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'
import { isDependencyObject, TPackageBump } from '@auto/utils'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writePackageDependencies = async (packageBumps: TPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.deps === null && bump.devDeps === null) {
      continue
    }

    const packageJsonPath = path.join(bump.dir, 'package.json')
    const packageJson = await getPackage(bump.dir)

    if (bump.deps !== null && isDependencyObject(packageJson.dependencies)) {
      for (const [depName, depRange] of Object.entries(bump.deps)) {
        packageJson.dependencies[depName] = depRange
      }
    }

    if (bump.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
      for (const [depName, depRange] of Object.entries(bump.devDeps)) {
        packageJson.devDependencies[depName] = depRange
      }
    }

    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}

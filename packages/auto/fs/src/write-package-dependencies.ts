import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'
import { isDependencyObject, TWorkspacesOptions, TWorkspacesPackageBump } from '@auto/utils'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writePackageDependencies = async (packageBumps: TWorkspacesPackageBump[], options: TWorkspacesOptions) => {
  for (const bump of packageBumps) {
    if (bump.deps === null && bump.devDeps === null) {
      continue
    }

    const packageJsonPath = path.join(bump.dir, 'package.json')
    const packageJson = await getPackage(bump.dir)

    if (bump.deps !== null && isDependencyObject(packageJson.dependencies)) {
      for (const [depName, depRange] of Object.entries(bump.deps)) {
        const fullDepName = `${options.autoNamePrefix}${depName}`

        packageJson.dependencies[fullDepName] = depRange
      }
    }

    if (bump.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
      for (const [depName, depRange] of Object.entries(bump.devDeps)) {
        const fullDepName = `${options.autoNamePrefix}${depName}`

        packageJson.devDependencies[fullDepName] = depRange
      }
    }

    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}

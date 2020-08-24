import path from 'path'
import { writeFile } from 'pifs'
import type { TReadonly } from 'tsfn'
import type { TPackageJson } from '../types'

export const writePackage = async (packageDir: string, packageJson: TReadonly<TPackageJson>): Promise<void> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJsonData = `${JSON.stringify(packageJson, null, 2)}\n`

  await writeFile(packageJsonPath, packageJsonData, { encoding: 'utf-8' })
}

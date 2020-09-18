import path from 'path'
import { writeFile } from 'pifs'
import type { TPackageJson } from './types'

export const writePackageJson = async (packageDir: string, packageJson: TPackageJson): Promise<void> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJsonData = `${JSON.stringify(packageJson, null, 2)}\n`

  await writeFile(packageJsonPath, packageJsonData, { encoding: 'utf-8' })
}

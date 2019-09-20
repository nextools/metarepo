import path from 'path'
import { TPackageJson } from '@auto/utils'
import { readFile } from 'pifs'

export const getPackage = async (packageDir: string): Promise<TPackageJson> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJsonData = await readFile(packageJsonPath, { encoding: 'utf8' })

  return JSON.parse(packageJsonData) as TPackageJson
}

import path from 'path'
import { readFile } from 'pifs'
import type { TPackageJson } from '../types'

export const readPackage = async (packageDir: string): Promise<TPackageJson> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJsonData = await readFile(packageJsonPath, { encoding: 'utf8' })

  return JSON.parse(packageJsonData)
}

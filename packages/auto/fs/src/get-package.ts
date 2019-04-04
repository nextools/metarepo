import path from 'path'
import { promisify } from 'util'
import { TPackageJson } from '@auto/utils'
import { readFile } from 'graceful-fs'

const pReadFile = promisify(readFile)

export const getPackage = async (packageDir: string): Promise<TPackageJson> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJsonData = await pReadFile(packageJsonPath, { encoding: 'utf8' })

  return JSON.parse(packageJsonData) as TPackageJson
}

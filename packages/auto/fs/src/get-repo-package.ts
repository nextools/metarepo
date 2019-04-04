import { TPackageJson } from '@auto/utils'
import { getPackage } from './get-package'

export const getRepoPackage = (): Promise<TPackageJson> => {
  return getPackage(process.cwd())
}

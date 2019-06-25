import { TPackages } from '@auto/utils'
import pAll from 'p-all'
import { getPackageDirs } from './get-package-dirs'
import { getPackage } from './get-package'

const MAX_OPEN_FILES = 100

export const getPackages = async (): Promise<TPackages> => {
  const dirs = await getPackageDirs()
  const packages = await pAll(
    dirs.map((dir) => () => getPackage(dir)),
    { concurrency: MAX_OPEN_FILES }
  )
  const names = packages.map((pkg) => pkg.name)

  return dirs.reduce(
    (res, dir, i) => {
      res[names[i]] = {
        dir,
        json: packages[i],
      }

      return res
    },
    {} as TPackages
  )
}

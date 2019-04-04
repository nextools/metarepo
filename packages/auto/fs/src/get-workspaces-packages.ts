import { removeAutoNamePrefix, TPackages, TWorkspacesOptions } from '@auto/utils'
import pAll from 'p-all'
import { getWorkspacesPackageDirs } from './get-workspaces-package-dirs'
import { getPackage } from './get-package'

const MAX_OPEN_FILES = 100

export const getWorkspacesPackages = async (options: TWorkspacesOptions): Promise<TPackages> => {
  const dirs = await getWorkspacesPackageDirs()
  const packages = await pAll(
    dirs.map((dir) => () => getPackage(dir)),
    { concurrency: MAX_OPEN_FILES }
  )
  const shortNames = packages.map((pkg) => removeAutoNamePrefix(pkg.name, options.autoNamePrefix))

  return dirs.reduce(
    (res, dir, i) => {
      res[shortNames[i]] = {
        dir,
        json: packages[i],
      }

      return res
    },
    {} as TPackages
  )
}

import pAll from 'p-all'
import type { TPackageMap } from '../types'
import { getPackageDirs } from './get-package-dirs'
import { readPackage } from './read-package'

const MAX_OPEN_FILES = 10

export const getPackages = async (): Promise<TPackageMap> => {
  const result: TPackageMap = new Map()
  const dirs = await getPackageDirs()

  await pAll(
    dirs.map((dir) => async () => {
      const pkg = await readPackage(dir)

      result.set(pkg.name, {
        dir,
        json: pkg,
      })
    }),
    { concurrency: MAX_OPEN_FILES }
  )

  return result
}

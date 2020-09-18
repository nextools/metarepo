import { map } from 'iterama'
import pAll from 'p-all'
import { getPackageDirs } from './get-package-dirs'
import { readPackageJson } from './read-package-json'
import type { TPackages } from './types'

const MAX_OPEN_FILES = 10

export const getPackages = async (): Promise<TPackages> => {
  const result: TPackages = new Map()
  const packageDirs = await getPackageDirs()

  await pAll(
    map((dir: string) => async () => {
      const json = await readPackageJson(dir)

      result.set(json.name, { dir, json })
    })(packageDirs),
    { concurrency: MAX_OPEN_FILES }
  )

  return result
}

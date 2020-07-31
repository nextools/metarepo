import pAll from 'p-all'
import { getPackageVersion } from './get-package-version'
import type { TDepsEntries } from './types'

export const getDepsVersions = (names: string[]): Promise<TDepsEntries> =>
  pAll(
    names.map((name) => async () => {
      const version = await getPackageVersion(name)

      return [name, `^${version}`] as [string, string]
    }),
    {
      concurrency: 4,
    }
  )

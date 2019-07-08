import { isUndefined } from 'tsfn'
import { TDepsEntries, TDepsObject } from './types'
import { objectFromEntries } from './object-from-entries'

export const composeDependencies = (dependenciesObject: TDepsObject | undefined, depsToAddWithVersions: TDepsEntries, depsToRemove: string[]): TDepsObject => {
  if (isUndefined(dependenciesObject)) {
    if (depsToAddWithVersions.length > 0) {
      return objectFromEntries(depsToAddWithVersions)
    }

    return {}
  }

  return objectFromEntries(
    Object.entries(dependenciesObject)
      .filter(([name]) => !depsToRemove.includes(name))
      .concat(depsToAddWithVersions)
  )
}

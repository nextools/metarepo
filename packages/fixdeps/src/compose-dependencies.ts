import { isUndefined } from 'tsfn'
import { objectFromEntries } from './object-from-entries'
import { TDepsEntries, TDepsObject } from './types'

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

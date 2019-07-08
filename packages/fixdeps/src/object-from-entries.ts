import { TDepsEntries, TDepsObject } from './types'

export const objectFromEntries = (entries: TDepsEntries): TDepsObject => {
  const sortedEntries = entries.slice().sort(([a], [b]) => a.localeCompare(b))

  return sortedEntries.reduce((acc, [key, value]) => {
    acc[key] = value

    return acc
  }, {} as TDepsObject)
}

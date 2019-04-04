import { TDepsEntries } from '../types'

export const entriesIncludes = (entries: TDepsEntries, name: string): boolean => {
  for (const [n] of entries) {
    if (n === name) {
      return true
    }
  }

  return false
}

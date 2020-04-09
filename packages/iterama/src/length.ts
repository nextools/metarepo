import { iterate } from './iterate'

export const length = <T>(iterable: Iterable<T>): number => {
  const iterator = iterate(iterable)
  let i = 0

  while (i < Number.MAX_SAFE_INTEGER && !iterator.next().done) {
    i++
  }

  return i
}

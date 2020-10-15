export const length = <T>(iterable: Iterable<T>): number => {
  const iterator = iterable[Symbol.iterator]()
  let i = 0

  while (i < Number.MAX_SAFE_INTEGER && iterator.next().done !== true) {
    ++i
  }

  return i
}

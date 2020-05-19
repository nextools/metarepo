export const toIterator = <T>(iterable: Iterable<T>): Iterator<T> => {
  return iterable[Symbol.iterator]()
}

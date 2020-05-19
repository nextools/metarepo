export const toIteratorAsync = <T>(iterable: AsyncIterable<T>): AsyncIterator<T> => {
  return iterable[Symbol.asyncIterator]()
}

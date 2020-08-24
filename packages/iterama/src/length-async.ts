export const lengthAsync = async <T>(iterable: AsyncIterable<T>): Promise<number> => {
  const iterator = iterable[Symbol.asyncIterator]()
  let i = 0

  while (i < Number.MAX_SAFE_INTEGER && !(await iterator.next()).done) {
    ++i
  }

  return i
}

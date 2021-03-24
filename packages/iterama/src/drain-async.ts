export const drainAsync = async (iterable: AsyncIterable<any>): Promise<void> => {
  const iterator = iterable[Symbol.asyncIterator]()
  let result = await iterator.next()

  while (result.done !== true) {
    result = await iterator.next()
  }
}

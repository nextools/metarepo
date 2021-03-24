export const broadcastAsync = <T>(it: AsyncIterable<T>): AsyncIterable<T> => {
  const iterator = it[Symbol.asyncIterator]()
  const buf: Promise<IteratorResult<T>>[] = []

  return {
    async *[Symbol.asyncIterator]() {
      let i = 0

      while (true) {
        if (buf.length <= i) {
          buf.push(iterator.next())
        }

        const result = await buf[i++]

        if (result.done === true) {
          break
        }

        yield result.value
      }
    },
  }
}

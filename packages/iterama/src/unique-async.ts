export const uniqueAsync = <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const buffer = new Set<T>()

    for await (const value of iterable) {
      if (!buffer.has(value)) {
        buffer.add(value)

        yield value
      }
    }
  },
})


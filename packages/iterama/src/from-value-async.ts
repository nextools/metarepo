export const fromValueAsync = <T>(value: () => T | Promise<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    yield value()
  },
})

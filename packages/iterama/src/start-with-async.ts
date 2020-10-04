export const startWithAsync = <T>(value: T) => (iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    yield value
    yield* iterable
  },
})

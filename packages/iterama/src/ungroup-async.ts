export const ungroupAsync = <T>(it: AsyncIterable<Iterable<T> | AsyncIterable<T>>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (const group of it) {
      yield* group
    }
  },
})

export const ungroupAsync = <T>(it: AsyncIterable<T[]>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (const group of it) {
      yield* group
    }
  },
})

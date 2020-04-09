export const rangeAsync = (length: number): AsyncIterable<number> => ({
  async *[Symbol.asyncIterator]() {
    for (let i = 0; i < length; i++) {
      yield await Promise.resolve(i)
    }
  },
})

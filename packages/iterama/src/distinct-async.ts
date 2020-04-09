export const distinctAsync = <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    let isFirst = true
    let last: T

    for await (const value of iterable) {
      if (isFirst || value !== last!) {
        last = value
        isFirst = false

        yield value
      }
    }
  },
})


export const finallyAsync = <T>(iterable: AsyncIterable<T>, onFinally: () => void): AsyncIterable<T> =>
  ({
    async *[Symbol.asyncIterator]() {
      try {
        yield* iterable
      } finally {
        onFinally()
      }
    },
  })

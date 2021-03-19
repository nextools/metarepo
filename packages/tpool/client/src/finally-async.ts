export const finallyAsync = (onFinally: () => void) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> =>
  ({
    async *[Symbol.asyncIterator]() {
      try {
        yield* iterable
      } finally {
        onFinally()
      }
    },
  })

export const finallyAsync = (onFinally: (() => void) | (() => Promise<void>)) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    try {
      yield* iterable
    } finally {
      await onFinally()
    }
  },
})

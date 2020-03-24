export const iterableFinally = <T>(iterable: AsyncIterable<T>, onFinally: () => Promise<any>): AsyncIterable<T> =>
  ({
    async *[Symbol.asyncIterator]() {
      try {
        for await (const result of iterable) {
          yield result
        }
      } finally {
        await onFinally()
      }
    },
  })

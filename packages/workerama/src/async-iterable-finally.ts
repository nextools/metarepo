export const asyncIterableFinally = <T>(iterable: AsyncIterable<T>, onFinally: () => AsyncIterable<any>): AsyncIterable<T> =>
  ({
    async *[Symbol.asyncIterator]() {
      try {
        for await (const result of iterable) {
          yield result
        }
      } finally {
        const finallyIterable = onFinally()
        const iterator = finallyIterable[Symbol.asyncIterator]()
        let result = await iterator.next()

        while (result.done !== true) {
          result = await iterator.next()
        }
      }
    },
  })

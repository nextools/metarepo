// export const iterableLength = (length: number): Iterable<number> => ({
//   *[Symbol.iterator]() {
//     for (let i = 0; i < length; i++) {
//       yield i
//     }
//   },
// })

export const iterableMap = <T, R>(fn: (arg: T) => R, iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    for (const i of iterable) {
      yield fn(i)
    }
  },
})

// export const iterableFind = <T>(fn: (arg: T) => boolean, iterable: Iterable<T>): T | undefined => {
//   for (const item of iterable) {
//     if (fn(item)) {
//       return item
//     }
//   }
// }

export const iterableFinally = <T>(iterable: AsyncIterable<T>, onFinally: () => AsyncIterable<any>): AsyncIterable<T> =>
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

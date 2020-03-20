export const makeIterable = <T extends any>(...examples: ((index: number) => T)[]): Iterable<T> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const example of examples) {
      yield example(i++)
    }
  },
})

export const makeNumIterable = (num: number) => ({
  *[Symbol.iterator]() {
    for (let i = 0; i < num; i++) {
      yield i
    }
  },
})

export const mapIterable = <T, R>(iterable: Iterable<T>, fn: (arg: T) => R): Iterable<R> => ({
  *[Symbol.iterator]() {
    for (const i of iterable) {
      yield fn(i)
    }
  },
})

// export const filterIterable = <T>(iterable: Iterable<T>, fn: (arg: T) => boolean): Iterable<T> => ({
//   *[Symbol.iterator]() {
//     for (const i of iterable) {
//       if (fn(i)) {
//         yield i
//       }
//     }
//   },
// })

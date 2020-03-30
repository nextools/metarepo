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

export const reduceIterable = <T, R>(reducer: (acc: R, entry: T, i: number) => R, initial: R, iterable: Iterable<T>): Iterable<R> =>
  ({
    *[Symbol.iterator]() {
      let i = 0
      let acc = initial

      for (const entry of iterable) {
        acc = reducer(acc, entry, i++)
      }

      yield acc
    },
  })

export const iterableGetFirst = <T>(iterable: Iterable<T>): T => {
  const iterator = iterable[Symbol.iterator]()
  const iteration = iterator.next()

  return iteration.value
}

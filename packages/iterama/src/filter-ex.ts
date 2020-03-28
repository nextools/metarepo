export type PredicateExFn<T> = (arg: T, i: number, iterable: Iterable<T>) => boolean

export const filterEx = <T> (pred: PredicateExFn<T>) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      if (pred(value, i++, iterable)) {
        yield value
      }
    }
  },
})


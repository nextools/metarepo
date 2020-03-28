export type PredicateFn<T> = (arg: T) => boolean

export const filter = <T> (pred: PredicateFn<T>) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    for (const value of iterable) {
      if (pred(value)) {
        yield value
      }
    }
  },
})


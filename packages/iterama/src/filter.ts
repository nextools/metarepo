export type PredicateFn<T> = (arg: T, index: number) => boolean

export const filter = <T> (pred: PredicateFn<T>) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      if (pred(value, i++)) {
        yield value
      }
    }
  },
})


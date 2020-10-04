export const startWith = <T>(value: T) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    yield value
    yield* iterable
  },
})

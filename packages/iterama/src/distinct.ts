export const distinct = <T> (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let last: T

    for (const value of iterable) {
      if (value !== last!) {
        last = value
        yield value
      }
    }
  },
})


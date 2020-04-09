export const distinct = <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let isFirst = true
    let last: T

    for (const value of iterable) {
      if (isFirst || value !== last!) {
        last = value
        isFirst = false

        yield value
      }
    }
  },
})


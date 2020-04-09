export const unique = <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const buffer = new Set<T>()

    for (const value of iterable) {
      if (!buffer.has(value)) {
        buffer.add(value)

        yield value
      }
    }
  },
})


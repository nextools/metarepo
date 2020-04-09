export type TFilterFn<T> = (arg: T, index: number) => boolean

export const filter = <T>(filterFn: TFilterFn<T>) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      if (filterFn(value, i++)) {
        yield value
      }
    }
  },
})


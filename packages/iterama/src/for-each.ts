export type TForEachFn<T> = (value: T, i: number) => void

export const forEach = <T>(forEachFn: TForEachFn<T>) => (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      forEachFn(value, i++)

      yield value
    }
  },
})

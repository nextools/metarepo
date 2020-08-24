export type TMapFn<T, R> = (value: T, i: number) => R

export const map = <T, R>(mapFn: TMapFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      yield mapFn(value, i++)
    }
  },
})

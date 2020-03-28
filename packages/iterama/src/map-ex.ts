export type TransformExFn<T, R> = (value: T, i: number, iterable: Iterable<T>) => R

export const mapEx = <T, R> (xf: TransformExFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      yield xf(value, i++, iterable)
    }
  },
})

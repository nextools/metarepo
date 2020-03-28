export type TransformFn<T, R> = (value: T) => R

export const map = <T, R> (xf: TransformFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    for (const value of iterable) {
      yield xf(value)
    }
  },
})

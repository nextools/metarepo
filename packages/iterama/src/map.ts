export type TransformFn<T, R> = (value: T, i: number) => R

export const map = <T, R> (xf: TransformFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let i = 0

    for (const value of iterable) {
      yield xf(value, i++)
    }
  },
})

export type TScanFn<T, R> = (acc: R, value: T, index: number) => R

export const scan = <T, R>(scanFn: TScanFn<T, R>, initial: R) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = initial
    let i = 0

    for (const value of iterable) {
      state = scanFn(state, value, i++)
      yield state
    }
  },
})


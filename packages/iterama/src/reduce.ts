export type ReducerFn<T, R> = (acc: R, val: T, index: number) => R

export const reduce = <T, R> (reducer: ReducerFn<T, R>, initial: R) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = initial
    let i = 0

    for (const value of iterable) {
      state = reducer(state, value, i++)
    }

    yield state
  },
})


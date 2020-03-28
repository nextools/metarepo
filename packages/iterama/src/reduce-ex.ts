export type ReducerExFn<T, R> = (acc: R, val: T, i: number, iterable: Iterable<T>) => R

export const reduceEx = <T, R> (reducer: ReducerExFn<T, R>, initial: R) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = initial
    let i = 0

    for (const value of iterable) {
      state = reducer(state, value, i++, iterable)
    }

    yield state
  },
})

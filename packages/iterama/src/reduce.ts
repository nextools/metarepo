export type ReducerFn<T, R> = (acc?: R, val?: T) => R

export const reduce = <T, R> (reducer: ReducerFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = reducer()

    for (const value of iterable) {
      state = reducer(state, value)
    }

    yield state
  },
})


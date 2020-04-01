import { ReducerFn } from './reduce'

export const scan = <T, R> (reducer: ReducerFn<T, R>, initial: R) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = initial
    let i = 0

    for (const value of iterable) {
      yield state = reducer(state, value, i++)
    }
  },
})


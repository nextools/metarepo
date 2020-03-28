import { ReducerFn } from './reduce'

export const scan = <T, R> (reducer: ReducerFn<T, R>) => (iterable: Iterable<T>): Iterable<R> => ({
  *[Symbol.iterator]() {
    let state = reducer()

    for (const value of iterable) {
      yield state = reducer(state, value)
    }
  },
})


import type { TObservable } from './types'

export const map = <T, R>(mapFn: (value: T, index: number) => R) => (observable: TObservable<T>): TObservable<R> =>
  (next, done, error) => {
    let i = 0

    return observable(
      (value) => {
        next(mapFn(value, i++))
      },
      done,
      error
    )
  }

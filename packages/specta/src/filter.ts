import type { TObservable } from './types'

export const filter = <T>(filterFn: (value: T, index: number) => boolean) => (observable: TObservable<T>): TObservable<T> =>
  (next, done, error) => {
    let i = 0

    return observable(
      (value) => {
        if (filterFn(value, i++)) {
          next(value)
        }
      },
      done,
      error
    )
  }

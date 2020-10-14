import FixedArray from 'circularr'
import type { TObservable } from './types'

export const skipFirst = <T>(n: number) => (observable: TObservable<T>): TObservable<T> =>
  (next, done, error) => {
    let i = 1

    return observable(
      (value) => {
        if (i <= n) {
          i++

          return
        }

        next(value)
      },
      done,
      error
    )
  }

export const skipLast = <T>(n: number) => (observable: TObservable<T>): TObservable<T> =>
  (next, done, error) => {
    let i = 1
    const last = new FixedArray<T>(n)

    return observable(
      (value) => {
        const result = last.shift(value)

        if (i <= n) {
          i++

          return
        }

        next(result)
      },
      done,
      error
    )
  }

export const skip = <T>(n: number) => (n < 0 ? skipLast<T>(-n) : skipFirst<T>(n))

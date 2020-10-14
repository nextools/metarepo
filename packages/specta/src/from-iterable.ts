import type { TObservable } from './types'

export const fromIterable = <T>(it: Iterable<T>): TObservable<T> =>
  (next, done, error) => {
    const timerId = setImmediate(() => {
      try {
        for (const value of it) {
          next(value)
        }
      } catch (e) {
        error?.(e)
      }

      done?.()
    })

    return () => {
      clearImmediate(timerId)
    }
  }

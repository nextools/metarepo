import { isFunction } from 'tsfn'
import type {
  TDone,
  TError,
  TNext,
  TObservable,
  TUnsubscribe,
} from './types'

export const share = <T>(observable: TObservable<T>): TObservable<T> => {
  const nextFns = new Set<TNext<T>>()
  const doneFns = new Set<TDone>()
  const errorFns = new Set<TError>()
  let unsubscribe: TUnsubscribe
  let shouldStart = true

  return (next, done, error) => {
    nextFns.add(next)

    if (isFunction(done)) {
      doneFns.add(done)
    }

    if (isFunction(error)) {
      errorFns.add(error)
    }

    if (shouldStart) {
      unsubscribe = observable(
        (value) => {
          for (const nextFn of nextFns) {
            nextFn(value)
          }
        },
        () => {
          for (const doneFn of doneFns) {
            doneFn()
          }
        },
        (err) => {
          for (const errorFn of errorFns) {
            errorFn(err)
          }
        }
      )

      shouldStart = false
    }

    return () => {
      nextFns.delete(next)

      if (isFunction(done)) {
        doneFns.delete(done)
      }

      if (isFunction(error)) {
        errorFns.delete(error)
      }

      if (nextFns.size === 0 && doneFns.size === 0 && errorFns.size === 0) {
        unsubscribe()

        shouldStart = true
      }
    }
  }
}

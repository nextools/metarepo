import { isFunction } from 'tsfn'
import type { TObservable, TUnsubscribe, TUnwrapObserverable } from './types'

export const merge = <O extends TObservable<any>>(observables: O[]): TObservable<TUnwrapObserverable<O>> =>
  (next, done, error) => {
    const unsubcribes = new Set<TUnsubscribe>()
    let doneCount = 0
    let observableCount = 0

    for (const observable of observables) {
      observableCount++

      const unsubscriber = observable(
        next,
        () => {
          doneCount++

          if (doneCount === observableCount && isFunction(done)) {
            done()
          }
        },
        error
      )

      unsubcribes.add(unsubscriber)
    }

    return () => {
      for (const unsubscribe of unsubcribes) {
        unsubscribe()
      }

      unsubcribes.clear()
    }
  }

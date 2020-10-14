import { isFunction } from 'tsfn'
import type { TObservable, TUnsubscribe, TUnwrapObserverable } from './types'

export const merge = <O extends TObservable<any>>(observables: Iterable<O>): TObservable<TUnwrapObserverable<O>> =>
  (next, done, error) => {
    const unsubcribers = new Set<TUnsubscribe>()
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

      unsubcribers.add(unsubscriber)
    }

    return () => {
      for (const unsubscriber of unsubcribers) {
        unsubscriber()
      }
    }
  }

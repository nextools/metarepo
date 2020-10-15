import type { TObservable, TUnsubscribe, TUnwrapObserverable } from './types'

// export type TCombine = {
//   <A>(observables: [TObservable<A>]): TObservable<[A]>,
//   <A, B>(observables: [TObservable<A>, TObservable<B>]): TObservable<[A, B]>,
//   <A, B, C>(observables: [TObservable<A>, TObservable<B>, TObservable<C>]): TObservable<[A, B, C]>,
//   <A, B, C, D>(observables: [TObservable<A>, TObservable<B>, TObservable<C>, TObservable<D>]): TObservable<[A, B, C, D]>,
// }
//
// export const combine: TCombine = (observables: TObservable<any>[]): TObservable<any> => {}

type TMapTuple<T> = T extends [infer F, ...infer R] ? [TUnwrapObserverable<F>, ...TMapTuple<R>] : []

export const combine = <O extends TObservable<any>[]>(observables: [...O]): TObservable<TMapTuple<O>> =>
  (next, done, error) => {
    if (observables.length > 31) {
      throw new Error('`combine` supports only up to 31 observables')
    }

    const results: unknown[] = Array(observables.length)
    const unsubcribes = new Set<TUnsubscribe>()
    let i = 0
    let doneCount = 0
    let mask = 0
    const checkMask = (1 << observables.length) - 1

    for (const observable of observables) {
      const index = i++

      const unsubscribe = observable(
        (value) => {
          results[index] = value

          mask |= 1 << index

          if ((mask ^ checkMask) === 0) {
            // TODO: how to get rid of any?..
            next(results as any)
          }
        },
        () => {
          if (doneCount < observables.length) {
            doneCount++

            return
          }

          done?.()
        },
        error
      )

      unsubcribes.add(unsubscribe)
    }

    return () => {
      for (const unsubscribe of unsubcribes) {
        unsubscribe()
      }

      unsubcribes.clear()
    }
  }

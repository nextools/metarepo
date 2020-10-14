import { share } from './share'
import type { TObservable } from './types'

export const publish = <T>(observable: TObservable<T>): TObservable<T> => {
  const sharedObservable = share(observable)

  sharedObservable(() => {})

  return sharedObservable
}

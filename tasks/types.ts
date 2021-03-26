import type { TAnyObject } from 'tsfn'

export type TNoInputPlugin<R> = () => AsyncIterableIterator<R>
export type TMaybeInputPlugin<T, R> = (it?: AsyncIterable<T>) => AsyncIterableIterator<R>
export type TPlugin<T, R> = (it: AsyncIterable<T>) => AsyncIterableIterator<R>

export type TTask<T, R> = (arg: T) => AsyncIterableIterator<R>

export type TFile = {
  path: string,
  data: string,
  // TODO: find correct type
  map?: TAnyObject,
}

import type { TAnyObject } from 'tsfn'

export type TNoInputTask<R> = () => Promise<AsyncIterable<R>>
export type TMaybeInputTask<T, R> = (it?: AsyncIterable<T>) => Promise<AsyncIterable<R>>
export type TTask<T, R> = (it: AsyncIterable<T>) => Promise<AsyncIterable<R>>

export type TFile = {
  path: string,
  data: string,
  // TODO: find correct type
  map?: TAnyObject,
}

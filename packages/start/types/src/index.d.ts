export declare type TNoInputPlugin<R> = () => AsyncIterableIterator<R>
export declare type TMaybeInputPlugin<T, R> = (it?: AsyncIterable<T>) => AsyncIterableIterator<R>
export declare type TPlugin<T, R> = (it: AsyncIterable<T>) => AsyncIterableIterator<R>

export declare type TTask<T, R> = (arg?: T) => AsyncIterableIterator<R>

export declare type TSourceMap = {
  version: number,
  sources: string[],
  names: string[],
  sourceRoot?: string,
  sourcesContent?: string[],
  mappings: string,
  file: string,
}

export declare type TFile = {
  path: string,
  data: string,
  map?: TSourceMap,
}

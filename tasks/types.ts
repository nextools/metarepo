export type TNoInputPlugin<R> = () => AsyncIterableIterator<R>
export type TMaybeInputPlugin<T, R> = (it?: AsyncIterable<T>) => AsyncIterableIterator<R>
export type TPlugin<T, R> = (it: AsyncIterable<T>) => AsyncIterableIterator<R>

export type TTask<T, R> = (arg: T) => AsyncIterableIterator<R>

export type TSourceMap = {
  version: number,
  sources: string[],
  names: string[],
  sourceRoot?: string,
  sourcesContent?: string[],
  mappings: string,
  file: string,
}

export type TFile = {
  path: string,
  data: string,
  map?: TSourceMap,
}

export type TGlobal = NodeJS.Global & {
  '@@start-source-maps': {
    [k: string]: TSourceMap,
  },
}

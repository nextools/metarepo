import type { ReactElement } from 'react'
import type { TJsonValue } from 'typeon'

export type TResultsType = Uint8Array | string

export type TEncoding = 'image' | 'text'

export type TPlugin<T extends TResultsType> = {
  name: string,
  encoding: TEncoding,
  appEntryPointPath: string,
  getResults: (files: string[]) => Promise<TTotalResults<T>>,
}

export type TExampleOptions = {
  backgroundColor?: string,
  maxWidth?: number,
  overflowTop?: number,
  overflowBottom?: number,
  overflowLeft?: number,
  overflowRight?: number,
  hasOwnWidth?: boolean,
}

export type TExample = {
  id: string,
  element: ReactElement,
  options?: TExampleOptions,
  meta?: (element: ReactElement) => TJsonValue,
}

export type TExampleResult<T> = {
  type: 'OK',
} | {
  type: 'DELETED',
  data: T,
  width: number,
  height: number,
  meta?: TJsonValue,
} | {
  type: 'NEW',
  data: T,
  width: number,
  height: number,
  meta?: TJsonValue,
} | {
  type: 'DIFF',
  data: T,
  width: number,
  height: number,
  origData: T,
  origWidth: number,
  origHeight: number,
  meta?: TJsonValue,
}

export type TExampleResults<T> = Map<string, TExampleResult<T>>

export type TFileResults<T> = {
  name: string,
  results: TExampleResults<T>,
  status: {
    ok: number,
    new: number,
    diff: number,
    deleted: number,
  },
}

export type TTotalResults<T> = Map<string, TFileResults<T>>

export type TItem = {
  type: 'DELETED',
  width: number,
  height: number,
} | {
  type: 'NEW',
  width: number,
  height: number,
} | {
  type: 'DIFF',
  width: number,
  height: number,
  origWidth: number,
  origHeight: number,
}

export type TListItems = {
  [id: string]: TItem,
}

export type TGetResponseQuery = {
  id: string,
  type: 'ORIG' | 'NEW',
}

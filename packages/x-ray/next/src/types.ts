import { ReactElement } from 'react'
import { TJsonValue } from 'typeon'

export type TExampleOptions = {
  hasOwnWidth?: boolean,
  backgroundColor?: string,
  maxWidth?: number,
  overflow?: number,
  overflowTop?: number,
  overflowBottom?: number,
  overflowLeft?: number,
  overflowRight?: number,
}

export type TExample = {
  id: string,
  element: ReactElement,
  options?: TExampleOptions,
  meta?: TJsonValue,
}

export type TWorkerResult<T> = {
  filePath: string,
  results: TCheckResults<T>,
  status: {
    ok: number,
    new: number,
    diff: number,
    deleted: number,
  },
}

export type TCheckResult<T> = {
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
  newData: T,
  newWidth: number,
  newHeight: number,
  origData: T,
  origWidth: number,
  origHeight: number,
  meta?: TJsonValue,
}

export type TCheckResults<T> = Map<string, TCheckResult<T>>

export type TResults = Map<string, TCheckResults<Uint8Array>>

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
  newWidth: number,
  newHeight: number,
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

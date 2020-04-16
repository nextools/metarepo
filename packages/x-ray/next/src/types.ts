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

export type TFileResults<T> = Map<string, TExampleResult<T>>

export type TTotalResults<T> = Map<string, {
  name: string,
  results: TFileResults<T>,
  status: {
    ok: number,
    new: number,
    diff: number,
    deleted: number,
  },
}>

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

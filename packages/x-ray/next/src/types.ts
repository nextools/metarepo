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

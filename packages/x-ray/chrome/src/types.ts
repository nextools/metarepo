import { ReactElement } from 'react'
import { TJsonValue } from 'typeon'
import { TOmitKey } from 'tsfn'

export type TItem = {
  id: string,
  element: ReactElement,
  meta: TJsonValue,
}

export type TCheckResults<T> = {
  [id: string]: {
    type: 'OK',
  } | {
    type: 'DELETED',
    data: T,
    width: number,
    height: number,
    meta: TJsonValue,
  } | {
    type: 'NEW',
    data: T,
    width: number,
    height: number,
    meta: TJsonValue,
  } | {
    type: 'DIFF',
    newData: T,
    newWidth: number,
    newHeight: number,
    origData: T,
    origWidth: number,
    origHeight: number,
    meta: TJsonValue,
  },
}

export type TWorkerResult<T> = {
  filePath: string,
  results: TCheckResults<T>,
}

export type TWorkerResultInternal<T> = {
  value: TWorkerResult<T>,
  transferList?: (ArrayBuffer | SharedArrayBuffer)[],
}

export type THttpList = {
  [id: string]: {
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
  },
}

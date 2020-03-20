import { ReactElement } from 'react'
import { TJsonValue } from 'typeon'

export type TExample = () => Promise<{
  id: string,
  element: ReactElement,
  meta: TJsonValue,
}>

export type TCheckOptions = {
  browserWSEndpoint: string,
  dpr: number,
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
  status: {
    ok: number,
    new: number,
    diff: number,
    deleted: number,
  },
}

export type TWorkerResultInternal<T> = {
  value: TWorkerResult<T>,
  transferList?: (ArrayBuffer | SharedArrayBuffer)[],
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

export type TItems = {
  [id: string]: TItem,
}

export type TResults = {
  [filePath: string]: TCheckResults<Uint8Array>,
}

export type TGetResponseQuery = {
  id: string,
  type: 'ORIG' | 'NEW',
}

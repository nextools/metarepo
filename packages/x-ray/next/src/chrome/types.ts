import { TJsonValue } from 'typeon'

export type TCheckOptions = {
  browserWSEndpoint: string,
  dpr: number,
}

export type TResults = Map<string, TCheckResults<Uint8Array>>

export type TCheckResults<T> = Map<string, {
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
}>

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


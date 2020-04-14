import { TCheckResults } from '../types'

export type TCheckOptions = {
  browserWSEndpoint: string,
  dpr: number,
}

export type TWorkerResult<T> = [string, {
  results: TCheckResults<T>,
  status: {
    ok: number,
    new: number,
    diff: number,
    deleted: number,
  },
}]

export type TWorkerResultInternal<T> = {
  value: TWorkerResult<T>,
  transferList?: (ArrayBuffer | SharedArrayBuffer)[],
}


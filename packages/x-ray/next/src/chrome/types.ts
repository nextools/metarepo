import { TWorkerResult } from '../types'

export type TCheckOptions = {
  browserWSEndpoint: string,
  dpr: number,
}

export type TWorkerResultInternal<T> = {
  value: TWorkerResult<T>,
  transferList?: (ArrayBuffer | SharedArrayBuffer)[],
}


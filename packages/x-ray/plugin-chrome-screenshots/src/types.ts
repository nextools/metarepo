import { TFileResults } from '@x-ray/core'

export type TCheckOptions = {
  browserWSEndpoint: string,
  dpr: number,
  shouldBailout: boolean,
}

export type TWorkerResult<T> = [string, {
  name: string,
  results: TFileResults<T>,
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


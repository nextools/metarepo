import { TExampleResults } from '@x-ray/core'

export type TCheckOptions = {
  shouldBailout: boolean,
}

export type TWorkerResult<T> = [string, {
  name: string,
  results: TExampleResults<T>,
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


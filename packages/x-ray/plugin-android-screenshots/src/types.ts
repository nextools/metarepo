import { TExampleResults } from '@x-ray/core'

export type TCheckOptions = {
  dpr: number,
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

export type TMessage =
  { type: 'EXAMPLE', isDone: false } |
  { type: 'EXAMPLE', isDone: true, value: TWorkerResult<Uint8Array> } |
  { type: 'ERROR', value: string }

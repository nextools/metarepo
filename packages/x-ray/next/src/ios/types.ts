import { TCheckResults } from '../types'

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

export type TMessage =
  { type: 'EXAMPLE', isDone: false } |
  { type: 'EXAMPLE', isDone: true, value: TWorkerResult<Uint8Array> } |
  { type: 'ERROR', value: string }

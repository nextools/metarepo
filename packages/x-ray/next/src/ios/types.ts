import { TWorkerResult } from '../types'

export type TMessage =
  { type: 'EXAMPLE', isDone: false } |
  { type: 'EXAMPLE', isDone: true, value: TWorkerResult<Uint8Array> } |
  { type: 'ERROR', value: string }

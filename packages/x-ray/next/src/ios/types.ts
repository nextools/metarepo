import { TWorkerResult } from '../types'

export type TMessage =
  { type: 'EXAMPLE' } |
  { type: 'DONE', value: TWorkerResult<Uint8Array> } |
  { type: 'ERROR', value: string }

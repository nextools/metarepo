import { TCheckResult } from '../types'

export type TMessage = {
  type: 'DONE',
  path: string,
  id: string,
  value: TCheckResult<Uint8Array>,
} | {
  type: 'ERROR',
  value: string,
}

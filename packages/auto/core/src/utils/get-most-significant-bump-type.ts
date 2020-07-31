import type { TReadonly } from 'tsfn'
import type { TReleaseType, TMessage } from '../types'
import { compareReleaseTypes } from './compare-release-types'

export const getMostSignificantBumpType = (messages: TReadonly<TMessage<TReleaseType>[]>): TReleaseType => {
  let result: TReleaseType | null = null

  for (const msg of messages) {
    if (compareReleaseTypes(msg.type, result) > 0) {
      result = msg.type
    }
  }

  if (result === null) {
    throw new Error('Could not get most significant bump type')
  }

  return result
}

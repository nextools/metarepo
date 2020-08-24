import type { TReadonly } from 'tsfn'
import type { TResolvedReleaseType, TReleaseType, TPromptEditData } from '../types'

const INITIAL_TYPE: TResolvedReleaseType = 'minor'
const ZERO_BREAKING_TYPE: TResolvedReleaseType = 'minor'

export const resolveReleaseType = (jsonVersion: string, type: TReleaseType, name: string, edit?: TReadonly<TPromptEditData>): TResolvedReleaseType => {
  if (type === 'initial') {
    return (edit?.initialTypeOverrideMap.get(name)) ?? INITIAL_TYPE
  }

  if (type === 'major' && jsonVersion.startsWith('0')) {
    return (edit?.zeroBreakingTypeOverrideMap.get(name)) ?? ZERO_BREAKING_TYPE
  }

  return type
}

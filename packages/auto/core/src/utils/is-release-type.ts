import type { TResolvedReleaseType } from '../types'

export const isResolvedReleaseType = (type: any): type is TResolvedReleaseType => {
  return type === 'major' || type === 'minor' || type === 'patch'
}

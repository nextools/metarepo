import semver from 'semver'
import type { TResolvedReleaseType } from '../types'

export const bumpVersion = (version: string, type: TResolvedReleaseType): string => {
  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  return coercedVersion.inc(type).version
}

import semver from 'semver'
import { TBumpType } from '@auto/utils'
import { bumpVersion } from './bump-version'
import { TBumpOptions } from './types'

export const bumpRange = (range: string, version: string, type: TBumpType, options: TBumpOptions): string => {
  if (/[<>=|]/.test(range)) {
    throw new Error(`range '${range}' is not supported`)
  }

  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  const matches = range.match(/^([\^~])?.+$/)

  if (matches === null) {
    throw new Error(`range ${range} is not supported`)
  }

  const symb = matches[1]
  const newVersion = bumpVersion(version, type, options)

  if (typeof symb === 'undefined') {
    return newVersion
  }

  if (semver.satisfies(newVersion, range)) {
    return `${symb}${newVersion}`
  }

  return `^${newVersion}`
}

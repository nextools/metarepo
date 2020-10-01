import { objectHas } from 'tsfn'
import { globalObject } from './global-object'

export const EMPTY_HASH = ''

export const getCurrentHash = (): string => {
  if (!objectHas(globalObject, 'location')) {
    return EMPTY_HASH
  }

  return globalObject.location.hash.substr(1)
}

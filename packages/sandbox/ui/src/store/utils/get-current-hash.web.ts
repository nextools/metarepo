import { globalObject } from '../../utils/global-object'

export const getCurrentHash = (): string | null => {
  const currentHash = globalObject.location.hash.substr(1)

  if (currentHash.length === 0) {
    return null
  }

  return currentHash
}

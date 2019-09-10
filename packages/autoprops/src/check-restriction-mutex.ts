import { BigInteger } from 'big-integer'

export const checkRestrictionMutexPropsChildren = (values: BigInteger[], keys: string[], childrenKeys: string[], mutexGroups: string[][]): boolean => {
  const propKeysLength = keys.length

  for (let i = 0; i < mutexGroups.length; ++i) {
    const mutexGroup = mutexGroups[i]
    let intersectCount = 0

    for (const mutexKey of mutexGroup) {
      for (let k = 0; k < keys.length; ++k) {
        if (!values[k].isZero() && mutexKey === keys[k]) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return true
        }
      }

      for (let k = 0; k < childrenKeys.length; ++k) {
        if (!values[k + propKeysLength].isZero() && mutexKey === childrenKeys[k]) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return true
        }
      }
    }
  }

  return false
}

export const checkRestrictionMutex = (values: BigInteger[], indexOffset: number, keys: string[], mutexGroups: string[][]): boolean => {
  for (let i = 0; i < mutexGroups.length; ++i) {
    const mutexGroup = mutexGroups[i]
    let intersectCount = 0

    for (const mutexKey of mutexGroup) {
      for (let k = 0; k < keys.length; ++k) {
        if (!values[k + indexOffset].isZero() && mutexKey === keys[k]) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return true
        }
      }
    }
  }

  return false
}

import { BigInteger } from 'big-integer'
import { TMutexConfig } from './types'

export const checkRestrictionMutex = (values: readonly BigInteger[], propKeys: readonly string[], childrenKeys: readonly string[], mutexGroups: TMutexConfig): boolean => {
  for (const mutexGroup of mutexGroups) {
    let intersectCount = 0

    for (const mutexKey of mutexGroup) {
      for (let i = 0; i < propKeys.length; ++i) {
        if (!values[i].isZero() && mutexKey === propKeys[i]) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return true
        }
      }

      for (let i = 0; i < childrenKeys.length; ++i) {
        if (!values[i + propKeys.length].isZero() && mutexKey === childrenKeys[i]) {
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

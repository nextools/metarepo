import { BigInteger } from 'big-integer'
import { TMutinConfig } from './types'

export const checkRestrictionMutin = (values: readonly BigInteger[], propKeys: readonly string[], childrenKeys: readonly string[], mutinGroups: TMutinConfig): number => {
  for (let groupIndex = 0; groupIndex < mutinGroups.length; groupIndex++) {
    const mutinGroup = mutinGroups[groupIndex]
    let intersectCount = 0

    for (const mutinKey of mutinGroup) {
      for (let i = 0; i < propKeys.length; ++i) {
        if (!values[i].isZero() && mutinKey === propKeys[i]) {
          ++intersectCount
        }
      }

      for (let i = 0; i < childrenKeys.length; ++i) {
        if (!values[i + propKeys.length].isZero() && mutinKey === childrenKeys[i]) {
          ++intersectCount
        }
      }
    }

    if (intersectCount > 0 && intersectCount !== mutinGroup.length) {
      return groupIndex
    }
  }

  return -1
}

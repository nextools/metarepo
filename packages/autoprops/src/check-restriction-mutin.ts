import { BigInteger } from 'big-integer'

export const checkRestrictionMutin = (values: BigInteger[], indexOffset: number, keys: string[], mutinGroups: string[][]): number => {
  for (let i = 0; i < mutinGroups.length; ++i) {
    const mutinGroup = mutinGroups[i]
    let intersectCount = 0

    for (const mutinKey of mutinGroup) {
      for (let k = 0; k < keys.length; ++k) {
        if (!values[k + indexOffset].isZero() && mutinKey === keys[k]) {
          ++intersectCount
        }
      }
    }

    if (intersectCount > 0 && intersectCount !== mutinGroup.length) {
      return i
    }
  }

  return -1
}

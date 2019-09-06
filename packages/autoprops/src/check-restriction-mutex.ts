import BigInt, { BigInteger } from 'big-integer'

export const checkRestrictionMutex = (values: BigInteger[], indexOffset: number, keys: string[], mutexGroups: string[][]): number => {
  for (let i = 0; i < mutexGroups.length; ++i) {
    const mutexGroup = mutexGroups[i]
    let intersectCount = 0

    for (const mutexKey of mutexGroup) {
      for (let k = 0; k < keys.length; ++k) {
        if (values[k + indexOffset].greater(BigInt.zero) && mutexKey === keys[k]) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return i
        }
      }
    }
  }

  return -1
}

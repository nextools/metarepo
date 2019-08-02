/* eslint-disable max-params */
import { isUndefined } from 'tsfn'

export const RESTRICTION_OK = 0
export const RESTRICTION_MUTEX = 1
export const RESTRICTION_MUTIN = 2

export const checkRestriction = (values: bigint[], valuesIndexOffset: number, propKeys: string[], mutexGroups?: string[][], mutinGroups?: string[][]): number => {
  if (isUndefined(mutexGroups) && isUndefined(mutinGroups)) {
    return RESTRICTION_OK
  }

  const keysWithState: string[] = []

  for (let i = 0; i < propKeys.length; ++i) {
    if (values[i + valuesIndexOffset] > 0) {
      keysWithState.push(propKeys[i])
    }
  }

  if (!isUndefined(mutexGroups)) {
    for (const mutexGroup of mutexGroups) {
      let intersectCount = 0

      for (const mutexKey of mutexGroup) {
        for (const keyWithState of keysWithState) {
          if (mutexKey === keyWithState) {
            ++intersectCount
          }

          if (intersectCount > 1) {
            return RESTRICTION_MUTEX
          }
        }
      }
    }
  }

  if (!isUndefined(mutinGroups)) {
    for (const mutinGroup of mutinGroups) {
      let intersectCount = 0

      for (const mutinKey of mutinGroup) {
        for (const keyWithState of keysWithState) {
          if (mutinKey === keyWithState) {
            ++intersectCount
          }
        }
      }

      if (intersectCount > 0 && intersectCount !== mutinGroup.length) {
        return RESTRICTION_MUTIN
      }
    }
  }

  return RESTRICTION_OK
}

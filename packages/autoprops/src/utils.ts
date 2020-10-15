import BigInt from 'big-integer'
import type { BigInteger } from 'big-integer'
import type { TReadonly } from 'tsfn'
import { isArray } from 'tsfn'
import type { TCommonRequiredConfig } from './types'

export const getIncrementedValueIndex = (values: readonly BigInteger[]): number => {
  for (let i = 0; i < values.length; ++i) {
    if (values[i].isZero() === false) {
      return i
    }
  }

  return 0
}

export const getPropNameByIndex = (changedValueIndex: number, propKeys: readonly string[], childrenKeys: readonly string[]): string | undefined => {
  return changedValueIndex < propKeys.length
    ? propKeys[changedValueIndex]
    : childrenKeys[changedValueIndex - propKeys.length]
}

export const adjustLengthForOptionalProp = (length: BigInteger, key: string, required?: TReadonly<TCommonRequiredConfig>): BigInteger => {
  if (isArray(required) && required.includes(key)) {
    return length
  }

  return BigInt.one.plus(length)
}

export const getPropIndex = (searchKey: string, propKeys: readonly string[], childrenKeys: readonly string[]): number | null => {
  // Search in propKeys first
  const propIndex = propKeys.indexOf(searchKey)

  if (propIndex >= 0) {
    return propIndex
  }

  // Search in childrenKeys
  const childIndex = childrenKeys.indexOf(searchKey)

  if (childIndex >= 0) {
    return childIndex + propKeys.length
  }

  return null
}

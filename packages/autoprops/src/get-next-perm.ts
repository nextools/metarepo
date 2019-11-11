/* eslint-disable no-use-before-define */
import { isDefined, isArray } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TComponentConfig, TRequiredConfig } from './types'
import { packPerm } from './pack-perm'
import { unpackPerm } from './unpack-perm'
import { parseBigInt } from './parse-bigint'
import { stringifyBigInt } from './stringify-bigint'
import { getNumSkipMutex } from './get-num-skip-mutex'
import { checkRestrictionMutex } from './check-restriction-mutex'
import { checkRestrictionMutin } from './check-restriction-mutin'
import { getNumSkipMutin } from './get-num-skip-mutin'

const getChildNextPerm = (int: BigInteger, childConfig: TComponentConfig, childKey: string, required?: TRequiredConfig): BigInteger | null => {
  if (isDefined(required) && required.includes(childKey)) {
    return getNextPermImpl(childConfig, int)
  }

  if (!int.isZero()) {
    const nextPerm = getNextPermImpl(childConfig, int.minus(BigInt.one))

    if (nextPerm === null) {
      return nextPerm
    }

    return nextPerm.plus(BigInt.one)
  }

  return int.plus(BigInt.one)
}

export const getNextPermImpl = (componentConfig: TComponentConfig, int: BigInteger): BigInteger | null => {
  const { values, length, propKeys, childrenKeys } = unpackPerm(componentConfig, int)

  if (values.length === 0) {
    return null
  }

  let i = 0

  for (; i < values.length; ++i) {
    // increment props or children
    if (i < propKeys.length) {
      values[i] = values[i].plus(BigInt.one)
    } else {
      const childKey = childrenKeys[i - propKeys.length]
      const childNextValue = getChildNextPerm(values[i], componentConfig.children![childKey].config, childKey, componentConfig.required)

      // handle child value overflow
      values[i] = childNextValue !== null ? childNextValue : length[i]
    }

    // if done incrementing
    if (values[i].notEquals(length[i])) {
      break
    }

    // if all digits overflow
    if (i === values.length - 1) {
      return null
    }

    // reset overflow digit
    values[i] = BigInt.zero
  }

  /* check restrictions */
  if (isArray(componentConfig.mutex) && checkRestrictionMutex(values, propKeys, childrenKeys, componentConfig.mutex)) {
    return getNextPermImpl(componentConfig, int.plus(getNumSkipMutex(values, length, i)))
  }

  if (isArray(componentConfig.mutin)) {
    const mutinGroupIndex = checkRestrictionMutin(values, propKeys, childrenKeys, componentConfig.mutin)

    if (mutinGroupIndex >= 0) {
      return getNextPermImpl(componentConfig, int.plus(getNumSkipMutin(values, length, propKeys, childrenKeys, componentConfig.mutin[mutinGroupIndex])))
    }
  }

  return packPerm(values, length)
}

export const getNextPerm = (componentConfig: TComponentConfig, intStr: string): string | null => {
  const result = getNextPermImpl(componentConfig, parseBigInt(intStr))

  if (result !== null) {
    return stringifyBigInt(result)
  }

  return result
}

/* eslint-disable no-use-before-define */
import { isUndefined, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { packPerm } from './pack-perm'
import { unpackPerm } from './unpack-perm'
import { parseBigInt } from './parse-bigint'
import { stringifyBigInt } from './stringify-bigint'
import { getNumSkipMutex } from './get-num-skip-mutex'
import { checkRestrictionMutex, checkRestrictionMutexPropsChildren } from './check-restriction-mutex'
import { checkRestrictionMutin } from './check-restriction-mutin'
import { getNumSkipMutin } from './get-num-skip-mutin'

const getChildNextPerm = (int: BigInteger, childMeta: TMetaFile, childKey: string, required?: string[]): BigInteger | null => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return getNextPermImpl(int, childMeta)
  }

  if (!int.isZero()) {
    const nextPerm = getNextPermImpl(int.minus(BigInt.one), childMeta)

    if (nextPerm === null) {
      return nextPerm
    }

    return nextPerm.plus(BigInt.one)
  }

  return int.plus(BigInt.one)
}

export const getNextPermImpl = (int: BigInteger, metaFile: TMetaFile): BigInteger | null => {
  const { values, length, propKeys } = unpackPerm(int, metaFile)

  if (values.length === 0) {
    return null
  }

  let i = 0

  for (; i < values.length; ++i) {
    // increment props or children
    if (i < propKeys.length) {
      values[i] = values[i].plus(BigInt.one)
    } else {
      const childrenConfig = metaFile.childrenConfig!
      const childKey = childrenConfig.children[i - propKeys.length]
      const childNextPerm = getChildNextPerm(values[i], childrenConfig.meta[childKey], childKey, childrenConfig.required)

      // handle child value overflow
      values[i] = childNextPerm !== null ? childNextPerm : length[i]
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
  if (i < propKeys.length) {
    if (metaFile.config.mutex) {
      const isRestricted = isDefined(metaFile.childrenConfig)
        ? checkRestrictionMutexPropsChildren(values, propKeys, metaFile.childrenConfig.children, metaFile.config.mutex)
        : checkRestrictionMutex(values, 0, propKeys, metaFile.config.mutex)

      if (isRestricted) {
        return getNextPermImpl(int.plus(getNumSkipMutex(values, length, i)), metaFile)
      }
    }

    if (metaFile.config.mutin) {
      const mutinGroupIndex = checkRestrictionMutin(values, 0, propKeys, metaFile.config.mutin)

      if (mutinGroupIndex >= 0) {
        return getNextPermImpl(int.plus(getNumSkipMutin(values, length, propKeys, metaFile.config.mutin[mutinGroupIndex], 0)), metaFile)
      }
    }
  } else {
    const childrenConfig = metaFile.childrenConfig!

    if (childrenConfig.mutex) {
      const isRestricted = checkRestrictionMutex(values, propKeys.length, childrenConfig.children, childrenConfig.mutex)

      if (isRestricted) {
        return getNextPermImpl(int.plus(getNumSkipMutex(values, length, i)), metaFile)
      }
    }

    if (childrenConfig.mutin) {
      const mutinGroupIndex = checkRestrictionMutin(values, propKeys.length, childrenConfig.children, childrenConfig.mutin)

      if (mutinGroupIndex >= 0) {
        return getNextPermImpl(int.plus(getNumSkipMutin(values, length, childrenConfig.children, childrenConfig.mutin[mutinGroupIndex], propKeys.length)), metaFile)
      }
    }
  }

  return packPerm(values, length)
}

export const getNextPerm = (intStr: string, metaFile: TMetaFile): string | null => {
  const result = getNextPermImpl(parseBigInt(intStr), metaFile)

  if (result !== null) {
    return stringifyBigInt(result)
  }

  return result
}

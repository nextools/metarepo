/* eslint-disable no-use-before-define */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { packPerm } from './pack-perm'
import { unpackPerm } from './unpack-perm'
import { parseBigInt } from './parse-bigint'
import { stringifyBigInt } from './stringify-bigint'
import { getNumSkipMutex } from './get-num-skip-mutex'
import { checkRestrictionMutex } from './check-restriction-mutex'
import { getKeysWithStateProps, getKeysWithStateChildren } from './get-keys-with-state'
import { checkRestrictionMutin } from './check-restriction-mutin'
import { getNumSkipMutin } from './get-num-skip-mutin'

const getChildNextPerm = (int: BigInteger, childMeta: TMetaFile, childKey: string, required?: string[]): BigInteger | null => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return getNextPermImpl(int, childMeta)
  } else if (int.greater(BigInt.zero)) {
    const nextPerm = getNextPermImpl(int.minus(BigInt.one), childMeta)

    if (nextPerm === null) {
      return nextPerm
    }

    return nextPerm.plus(BigInt.one)
  }

  return int.plus(BigInt.one)
}

export const getNextPermImpl = (int: BigInteger, metaFile: TMetaFile): BigInteger | null => {
  const propsKeys = Object.keys(metaFile.config.props)
  const { values, length } = unpackPerm(int, metaFile)

  if (values.length === 0) {
    return null
  }

  let i = 0

  for (; i < values.length; ++i) {
    // increment props or children
    if (i < propsKeys.length) {
      values[i] = values[i].plus(BigInt.one)
    } else {
      const childrenConfig = metaFile.childrenConfig!
      const childKey = childrenConfig.children[i - propsKeys.length]
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
  if (i < propsKeys.length) {
    let keysWithState

    if (metaFile.config.mutex || metaFile.config.mutin) {
      keysWithState = getKeysWithStateProps(values, propsKeys)

      if (metaFile.config.mutex) {
        const mutexGroupIndex = checkRestrictionMutex(keysWithState, metaFile.config.mutex)

        if (mutexGroupIndex >= 0) {
          return getNextPermImpl(int.plus(getNumSkipMutex(values, length, i)), metaFile)
        }
      }

      if (metaFile.config.mutin) {
        const mutinGroupIndex = checkRestrictionMutin(keysWithState, metaFile.config.mutin)

        if (mutinGroupIndex >= 0) {
          return getNextPermImpl(int.plus(getNumSkipMutin(values, length, propsKeys, metaFile.config.mutin[mutinGroupIndex], 0)), metaFile)
        }
      }
    }
  } else {
    const childrenConfig = metaFile.childrenConfig!
    let keysWithState

    if (childrenConfig.mutex || childrenConfig.mutin) {
      keysWithState = getKeysWithStateChildren(values, childrenConfig.children, propsKeys.length)

      if (childrenConfig.mutex) {
        const mutexGroupIndex = checkRestrictionMutex(keysWithState, childrenConfig.mutex)

        if (mutexGroupIndex >= 0) {
          return getNextPermImpl(int.plus(getNumSkipMutex(values, length, i)), metaFile)
        }
      }

      if (childrenConfig.mutin) {
        const mutinGroupIndex = checkRestrictionMutin(keysWithState, childrenConfig.mutin)

        if (mutinGroupIndex >= 0) {
          return getNextPermImpl(int.plus(getNumSkipMutin(values, length, childrenConfig.children, childrenConfig.mutin[mutinGroupIndex], propsKeys.length)), metaFile)
        }
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

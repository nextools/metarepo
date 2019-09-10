/* eslint-disable max-params, no-use-before-define */
import { isUndefined, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { unpackPerm } from './unpack-perm'
import { packPerm } from './pack-perm'
import { stringifyBigInt } from './stringify-bigint'
import { parseBigInt } from './parse-bigint'
import { getBaseName, getIndexedNameIndex } from './get-indexed-name'
import { applyDisableMutins } from './apply-disable-mutins'
import { applyEnableMutins } from './apply-enable-mutins'
import { applyDisableMutexes } from './apply-disable-mutexes'

const applyChildPropValue = (int: BigInteger, childMeta: TMetaFile, propPath: string[], propValue: any, childKey: string, required?: string[]): BigInteger => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return applyPropValueImpl(int, childMeta, propPath, propValue)
  }

  if (!int.isZero()) {
    return applyPropValueImpl(int.minus(BigInt.one), childMeta, propPath, propValue).plus(BigInt.one)
  }

  throw new Error(`path error: child "${childKey}" was not enabled, but path points inside it`)
}

const applyPropValueImpl = (int: BigInteger, metaFile: TMetaFile, propPath: string[], propValue: any): BigInteger => {
  const { values, length, propKeys } = unpackPerm(int, metaFile)

  // check if local prop has changed
  if (propPath.length === 1) {
    const [propName] = propPath
    const propIndex = propKeys.indexOf(propName)

    // check path not found case
    if (propIndex < 0) {
      throw new Error(`prop path error: could not find prop "${propName}" following path "[${propPath}]"`)
    }

    const propValues = metaFile.config.props[propName]
    const isPropRequired = !isUndefined(metaFile.config.required) && metaFile.config.required.includes(propName)
    const propValueIndex = propValues.indexOf(propValue) + (isPropRequired ? 0 : 1)

    // check selected value = undefined
    if (propValueIndex <= 0) {
      values[propIndex] = BigInt.zero

      // check mutin
      if (isDefined(metaFile.config.mutin)) {
        applyDisableMutins(values, 0, propKeys, propName, metaFile.config.mutin)
      }

      return packPerm(values, length)
    }

    values[propIndex] = BigInt(propValueIndex)

    // check mutin
    if (isDefined(metaFile.config.mutin)) {
      applyEnableMutins(values, 0, propKeys, propName, metaFile.config.mutin, metaFile.config.required)
    }

    // check mutex
    if (isDefined(metaFile.config.mutex)) {
      applyDisableMutexes(values, 0, propKeys, propName, metaFile.config.mutex)
    }

    return packPerm(values, length)
  }

  if (isDefined(metaFile.childrenConfig) && propPath[0] === 'children') {
    const childName = propPath[1]
    const childBaseName = getBaseName(childName)
    const childIndex = getIndexedNameIndex(metaFile.childrenConfig.children, childName) + propKeys.length

    if (propPath.length > 2) {
      values[childIndex] = applyChildPropValue(values[childIndex], metaFile.childrenConfig.meta[childBaseName], propPath.slice(2), propValue, childBaseName, metaFile.childrenConfig.required)

      return packPerm(values, length)
    }

    if (isUndefined(propValue)) {
      values[childIndex] = BigInt.zero

      if (isDefined(metaFile.childrenConfig.mutin)) {
        applyDisableMutins(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutin)
      }

      return packPerm(values, length)
    }

    values[childIndex] = BigInt.one

    if (isDefined(metaFile.childrenConfig.mutin)) {
      applyEnableMutins(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutin)
    }

    if (isDefined(metaFile.childrenConfig.mutex)) {
      applyDisableMutexes(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutex)
    }

    return packPerm(values, length)
  }

  throw new Error(`prop path error: incorrect path "[${propPath}]"`)
}

export const applyPropValue = (intStr: string, metaFile: TMetaFile, propPath: string[], propValue: any): string => {
  return stringifyBigInt(applyPropValueImpl(parseBigInt(intStr), metaFile, propPath, propValue))
}

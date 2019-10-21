/* eslint-disable max-params, no-use-before-define */
import { isUndefined, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TComponentConfig, TRequiredConfig } from './types'
import { unpackPerm } from './unpack-perm'
import { packPerm } from './pack-perm'
import { stringifyBigInt } from './stringify-bigint'
import { parseBigInt } from './parse-bigint'
import { applyDisableMutins } from './apply-disable-mutins'
import { applyEnableMutins } from './apply-enable-mutins'
import { applyDisableMutexes } from './apply-disable-mutexes'

const applyChildPropValue = (int: BigInteger, childConfig: TComponentConfig, propPath: readonly string[], propValue: any, childKey: string, required?: TRequiredConfig): BigInteger => {
  if (isDefined(required) && required.includes(childKey)) {
    return applyPropValueImpl(childConfig, int, propPath, propValue)
  }

  if (!int.isZero()) {
    return applyPropValueImpl(childConfig, int.minus(BigInt.one), propPath, propValue).plus(BigInt.one)
  }

  throw new Error(`path error: child "${childKey}" was not enabled, but path points inside it`)
}

const applyPropValueImpl = (componentConfig: TComponentConfig, int: BigInteger, propPath: readonly string[], propValue: any): BigInteger => {
  const { values, length, propKeys, childrenKeys } = unpackPerm(componentConfig, int)
  const pathValue = propPath[0]
  const propIndex = propKeys.indexOf(pathValue)

  // check path pointing to prop
  if (propPath.length === 1 && propIndex >= 0) {
    const propValues = componentConfig.props[pathValue]
    const isPropRequired = isDefined(componentConfig.required) && componentConfig.required.includes(pathValue)
    const propValueIndex = propValues.indexOf(propValue) + (isPropRequired ? 0 : 1)

    // check selected value = undefined
    if (propValueIndex <= 0) {
      values[propIndex] = BigInt.zero

      // check mutin
      if (isDefined(componentConfig.mutin)) {
        applyDisableMutins(values, pathValue, propKeys, childrenKeys, componentConfig.mutin)
      }

      return packPerm(values, length)
    }

    values[propIndex] = BigInt(propValueIndex)

    // check mutin
    if (isDefined(componentConfig.mutin)) {
      applyEnableMutins(values, pathValue, propKeys, childrenKeys, componentConfig.mutin, componentConfig.required)
    }

    // check mutex
    if (isDefined(componentConfig.mutex)) {
      applyDisableMutexes(values, pathValue, propKeys, childrenKeys, componentConfig.mutex)
    }

    return packPerm(values, length)
  }

  // check path pointing to child
  const childIndex = childrenKeys.indexOf(pathValue) + propKeys.length

  if (childIndex >= propKeys.length) {
    // check path pointing inside child
    if (propPath.length > 1) {
      values[childIndex] = applyChildPropValue(values[childIndex], componentConfig.children![pathValue].config, propPath.slice(1), propValue, pathValue, componentConfig.required)

      return packPerm(values, length)
    }

    if (isUndefined(propValue)) {
      values[childIndex] = BigInt.zero

      if (isDefined(componentConfig.mutin)) {
        applyDisableMutins(values, pathValue, propKeys, childrenKeys, componentConfig.mutin)
      }

      return packPerm(values, length)
    }

    values[childIndex] = BigInt.one

    if (isDefined(componentConfig.mutin)) {
      applyEnableMutins(values, pathValue, propKeys, childrenKeys, componentConfig.mutin)
    }

    if (isDefined(componentConfig.mutex)) {
      applyDisableMutexes(values, pathValue, propKeys, childrenKeys, componentConfig.mutex)
    }

    return packPerm(values, length)
  }

  throw new Error(`prop path error: incorrect path "[${propPath}]"`)
}

export const applyPropValue = (componentConfig: TComponentConfig, intStr: string, propPath: string[], propValue: any): string => {
  return stringifyBigInt(applyPropValueImpl(componentConfig, parseBigInt(intStr), propPath, propValue))
}

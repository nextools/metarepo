/* eslint-disable max-params, no-use-before-define */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TCommonRequiredConfig, TCommonComponentConfig } from './types'
import { unpackPerm } from './unpack-perm'
import { packPerm } from './pack-perm'
import { stringifyBigInt } from './stringify-bigint'
import { parseBigInt } from './parse-bigint'
import { applyDisableDeps } from './apply-disable-deps'
import { applyEnableDeps } from './apply-enable-deps'
import { applyDisableMutexes } from './apply-disable-mutexes'
import { applyEnableChildren } from './apply-enable-children'

const applyChildPropValue = (int: BigInteger, childConfig: TCommonComponentConfig, propPath: readonly string[], propValue: any, childKey: string, required?: TCommonRequiredConfig): BigInteger => {
  if (required?.includes(childKey)) {
    return applyPropValueImpl(childConfig, int, propPath, propValue)
  }

  if (!int.isZero()) {
    return applyPropValueImpl(childConfig, int.minus(BigInt.one), propPath, propValue).plus(BigInt.one)
  }

  throw new Error(`path error: child "${childKey}" was not enabled, but path points inside it`)
}

const applyPropValueImpl = (componentConfig: TCommonComponentConfig, int: BigInteger, propPath: readonly string[], propValue: any): BigInteger => {
  const perm = unpackPerm(componentConfig, int)
  const { values, lengths, propKeys, childrenKeys } = perm
  const pathKey = propPath[0]

  // check path pointing to prop
  const propIndex = propKeys.indexOf(pathKey)

  if (propPath.length === 1 && propIndex >= 0) {
    const propValues = componentConfig.props[pathKey]!
    const isPropRequired = Boolean(componentConfig.required?.includes(pathKey))
    const propValueIndex = propValues.indexOf(propValue) + (isPropRequired ? 0 : 1)

    // Check if disables prop
    if (propValueIndex <= 0) {
      values[propIndex] = BigInt.zero
      // Disable dependent props
      applyDisableDeps(values, pathKey, perm, componentConfig)

      return packPerm(values, lengths)
    }

    // Enables prop
    values[propIndex] = BigInt(propValueIndex)
    // Disable Mutexes
    applyDisableMutexes(values, pathKey, perm, componentConfig)
    // Enable Deps
    applyEnableDeps(values, pathKey, perm, componentConfig)

    return packPerm(values, lengths)
  }

  // check path pointing to child
  const childIndex = childrenKeys.indexOf(pathKey) + propKeys.length

  if (childIndex >= propKeys.length) {
    // check path pointing inside child
    if (propPath.length > 1) {
      values[childIndex] = applyChildPropValue(values[childIndex], componentConfig.children![pathKey]!.config, propPath.slice(1), propValue, pathKey, componentConfig.required)

      return packPerm(values, lengths)
    }

    // Path points at the child
    // Check if tries to disable child
    if (isUndefined(propValue)) {
      values[childIndex] = BigInt.zero
      // Disable dependent props
      applyDisableDeps(values, pathKey, perm, componentConfig)
      // Check children restriction
      applyEnableChildren(values, pathKey, perm, componentConfig)

      return packPerm(values, lengths)
    }

    // Enables child
    values[childIndex] = BigInt.one
    // Disable mutexes
    applyDisableMutexes(values, pathKey, perm, componentConfig)
    // Enable deps
    applyEnableDeps(values, pathKey, perm, componentConfig)

    return packPerm(values, lengths)
  }

  throw new Error(`prop path error: incorrect path "[${propPath}]"`)
}

export const applyPropValue = (componentConfig: TCommonComponentConfig, intStr: string, propPath: string[], propValue: any): string => {
  return stringifyBigInt(applyPropValueImpl(componentConfig, parseBigInt(intStr), propPath, propValue))
}

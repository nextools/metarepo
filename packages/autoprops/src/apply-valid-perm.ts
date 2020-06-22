/* eslint-disable no-use-before-define */
import BigInt, { BigInteger } from 'big-integer'
import { TCommonComponentConfig } from './types'
import { unpackPerm } from './unpack-perm'
import { packPerm } from './pack-perm'
import { stringifyBigInt } from './stringify-bigint'
import { parseBigInt } from './parse-bigint'
import { applyDisableDeps } from './apply-disable-deps'
import { applyEnableDeps } from './apply-enable-deps'
import { applyEnableChildren } from './apply-enable-children'

const applyChildPropValue = (int: BigInteger, childConfig: TCommonComponentConfig, isChildRequired: boolean): BigInteger => {
  if (isChildRequired) {
    return applyValidPermImpl(childConfig, int)
  }

  if (int.isZero()) {
    return int
  }

  return applyValidPermImpl(childConfig, int.minus(BigInt.one)).plus(BigInt.one)
}

const applyValidPermImpl = (componentConfig: TCommonComponentConfig, int: BigInteger): BigInteger => {
  const perm = unpackPerm(componentConfig, int)
  const { values, lengths, propKeys, childrenKeys } = perm

  // Iterate over all props
  for (let i = 0; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const isPropActive = values[i].isZero() === false || Boolean(componentConfig.required?.includes(propKey))

    if (isPropActive) {
      applyEnableDeps(values, propKey, perm, componentConfig)
    } else {
      applyDisableDeps(values, propKey, perm, componentConfig)
    }
  }

  applyEnableChildren(values, '', perm, componentConfig)

  // Iterate over all children
  for (let i = 0; i < childrenKeys.length; ++i) {
    const childIndex = i + propKeys.length
    const childKey = childrenKeys[i]
    const childConfig = componentConfig.children![childKey]!.config

    // Validate every child
    values[childIndex] = applyChildPropValue(values[childIndex], childConfig, Boolean(componentConfig.required?.includes(childKey)))
  }

  return packPerm(values, lengths)
}

export const applyValidPerm = (componentConfig: TCommonComponentConfig, intStr: string): string => {
  return stringifyBigInt(applyValidPermImpl(componentConfig, parseBigInt(intStr)))
}

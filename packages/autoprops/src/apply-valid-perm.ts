/* eslint-disable max-params, no-use-before-define */
import BigInt, { BigInteger } from 'big-integer'
import { TCommonRequiredConfig, TCommonComponentConfig } from './types'
import { unpackPerm } from './unpack-perm'
import { packPerm } from './pack-perm'
import { stringifyBigInt } from './stringify-bigint'
import { parseBigInt } from './parse-bigint'
import { applyDisableDeps } from './apply-disable-deps'
import { applyEnableDeps } from './apply-enable-deps'
import { applyEnableChildren } from './apply-enable-children'

const applyChildPropValue = (int: BigInteger, childConfig: TCommonComponentConfig, childKey: string, required?: TCommonRequiredConfig): BigInteger => {
  if (required?.includes(childKey)) {
    return applyValidPermImpl(childConfig, int)
  }

  return applyValidPermImpl(childConfig, int.minus(BigInt.one)).plus(BigInt.one)
}

const applyValidPermImpl = (componentConfig: TCommonComponentConfig, int: BigInteger): BigInteger => {
  const perm = unpackPerm(componentConfig, int)
  const { values, lengths, propKeys, childrenKeys } = perm

  for (let i = 0; i < propKeys.length; ++i) {
    const isPropActive = values[i].isZero() === false || Boolean(componentConfig.required?.includes(propKeys[i]))

    if (isPropActive) {
      applyEnableDeps(values, propKeys[i], perm, componentConfig)
    } else {
      applyDisableDeps(values, propKeys[i], perm, componentConfig)
    }
  }

  applyEnableChildren(values, '', perm, componentConfig)

  for (let i = 0; i < childrenKeys.length; ++i) {
    const childKey = childrenKeys[i]
    const childConfig = componentConfig.children![childKey]!.config

    applyChildPropValue(values[i + propKeys.length], childConfig, childKey, componentConfig.required)
  }

  return packPerm(values, lengths)
}

export const applyValidPerm = (componentConfig: TCommonComponentConfig, intStr: string): string => {
  return stringifyBigInt(applyValidPermImpl(componentConfig, parseBigInt(intStr)))
}

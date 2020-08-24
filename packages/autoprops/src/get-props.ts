/* eslint-disable no-use-before-define */
import BigInt from 'big-integer'
import type { BigInteger } from 'big-integer'
import { isDefined } from 'tsfn'
import type { TAnyObject, TWritable, TReadonly } from 'tsfn'
import { parseBigInt } from './parse-bigint'
import type { TChildrenMap, TCommonRequiredConfig, TCommonComponentConfig } from './types'
import { unpackPerm } from './unpack-perm'

const getValue = (valueIndex: number, values: readonly any[], key: string, required?: TReadonly<TCommonRequiredConfig>): any => {
  if (required?.includes(key)) {
    return values[valueIndex]
  }

  if (valueIndex > 0) {
    return values[valueIndex - 1]
  }
}

const getChildValue = (childConfig: TCommonComponentConfig, int: BigInteger, childKey: string, required?: TReadonly<TCommonRequiredConfig>): any => {
  if (required?.includes(childKey)) {
    return getPropsImpl(childConfig, int)
  }

  if (!int.isZero()) {
    return getPropsImpl(childConfig, int.minus(BigInt.one))
  }
}

export const getPropsImpl = (componentConfig: TCommonComponentConfig, int: BigInteger): TAnyObject => {
  const result: TAnyObject = {}
  const { values, propKeys, childrenKeys } = unpackPerm(componentConfig, int)

  let i = 0

  for (; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const valueIndex = values[i]
    const value = getValue(valueIndex.toJSNumber(), componentConfig.props[propKey]!, propKey, componentConfig.required)

    if (isDefined(value)) {
      result[propKey] = value
    }
  }

  if (isDefined(componentConfig.children)) {
    const childrenMap: TWritable<TChildrenMap> = {}
    let hasChildren = false

    for (; i < values.length; ++i) {
      const childKey = childrenKeys[i - propKeys.length]
      const valueInt = values[i]
      const value = getChildValue(componentConfig.children[childKey]!.config, valueInt, childKey, componentConfig.required)

      if (isDefined(value)) {
        childrenMap[childKey] = value
        hasChildren = true
      }
    }

    if (hasChildren) {
      result.children = childrenMap
    }
  }

  return result
}

export const getProps = (componentConfig: TCommonComponentConfig, intStr: string): TAnyObject => {
  return getPropsImpl(componentConfig, parseBigInt(intStr))
}

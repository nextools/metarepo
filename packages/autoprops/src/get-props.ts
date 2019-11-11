/* eslint-disable no-use-before-define */
import { TAnyObject, isDefined, TWritable } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TComponentConfig, TChildrenMap, TRequiredConfig } from './types'
import { unpackPerm } from './unpack-perm'
import { parseBigInt } from './parse-bigint'

const getValue = (valueIndex: number, values: readonly any[], key: string, required?: TRequiredConfig): any => {
  if (isDefined(required) && required.includes(key)) {
    return values[valueIndex]
  }

  if (valueIndex > 0) {
    return values[valueIndex - 1]
  }
}

const getChildValue = (childConfig: TComponentConfig, int: BigInteger, childKey: string, required?: TRequiredConfig): any => {
  if (isDefined(required) && required.includes(childKey)) {
    return getPropsImpl(childConfig, int)
  }

  if (!int.isZero()) {
    return getPropsImpl(childConfig, int.minus(BigInt.one))
  }
}

export const getPropsImpl = (componentConfig: TComponentConfig, int: BigInteger): TAnyObject => {
  const result: TAnyObject = {}
  const { values, propKeys, childrenKeys } = unpackPerm(componentConfig, int)

  let i = 0

  for (; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const valueIndex = values[i]
    const value = getValue(valueIndex.toJSNumber(), componentConfig.props[propKey], propKey, componentConfig.required)

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
      const value = getChildValue(componentConfig.children[childKey].config, valueInt, childKey, componentConfig.required)

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

export const getProps = (componentConfig: TComponentConfig, intStr: string): TAnyObject => {
  return getPropsImpl(componentConfig, parseBigInt(intStr))
}

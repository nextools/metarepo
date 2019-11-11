/* eslint-disable no-use-before-define */
import { isValidElement, ReactElement, FC } from 'react'
import { isFunction, isSymbol, isRegExp, TAnyObject, isString, isDefined, TWritable, isObject, isArray } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TComponentConfig, TChildrenMap, TRequiredConfig } from './types'
import { unpackPerm } from './unpack-perm'

const getElementName = (element: ReactElement) => {
  if (isString(element.type)) {
    return element.type
  }

  if (isString((element.type as FC).displayName)) {
    return (element.type as FC).displayName
  }

  // @ts-ignore
  if (element.type === Symbol.for('react.fragment')) {
    return 'Fragment'
  }

  return element.type.name
}

const getValue = (valueIndex: number, values: readonly any[], key: string, required?: TRequiredConfig): string | undefined => {
  let index = -1

  if (isDefined(required) && required.includes(key)) {
    index = valueIndex
  } else if (valueIndex > 0) {
    index = valueIndex - 1
  }

  if (index < 0) {
    return
  }

  const value = values[index]

  if (isFunction(value)) {
    return value.name === ''
      ? `[function(${index})]`
      : `[function(${value.name}) (${index})]`
  }

  if (isSymbol(value)) {
    return `[${value.toString()} (${index})]`
  }

  if (isRegExp(value)) {
    return `[regexp(${value}) (${index})]`
  }

  if (isValidElement(value)) {
    return `[react(${getElementName(value)}) (${index})]`
  }

  if (isArray(value)) {
    return `[array(${index})]`
  }

  if (isObject(value)) {
    return `[object(${index})]`
  }

  return `${value}`
}

const getChildValue = (int: BigInteger, childConfig: TComponentConfig, childKey: string, required?: TRequiredConfig): TAnyObject | undefined => {
  if (isDefined(required) && required.includes(childKey)) {
    return getPropsImpl(childConfig, int)
  }

  if (!int.isZero()) {
    return getPropsImpl(childConfig, int.minus(BigInt.one))
  }
}

const getPropsImpl = (componentConfig: TComponentConfig, int: BigInteger): TAnyObject => {
  const result: TAnyObject = {}
  const { values, propKeys, childrenKeys } = unpackPerm(componentConfig, int)

  let i = 0

  for (; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const valueIndex = values[i].toJSNumber()
    const value = getValue(valueIndex, componentConfig.props[propKey], propKey, componentConfig.required)

    if (isString(value)) {
      result[propKey] = value
    }
  }

  if (isDefined(componentConfig.children)) {
    const childrenMap: TWritable<TChildrenMap> = {}
    let hasChildren = false

    for (; i < values.length; ++i) {
      const childIndex = i - propKeys.length
      const childKey = childrenKeys[childIndex]
      const valueIndex = values[i]
      const value = getChildValue(valueIndex, componentConfig.children[childKey].config, childKey, componentConfig.required)

      if (isDefined(value)) {
        childrenMap[childKey] = value
        hasChildren = true
      }
    }

    if (hasChildren) {
      const sortedChildrenKeys = childrenKeys.slice().sort((a, b) => a.localeCompare(b))
      const sortedChildrenMap: TWritable<TChildrenMap> = {}

      for (const key of sortedChildrenKeys) {
        if (Reflect.has(childrenMap, key)) {
          sortedChildrenMap[key] = childrenMap[key]
        }
      }

      result.children = sortedChildrenMap
    }
  }

  return result
}

export const serializeProps = (componentConfig: TComponentConfig, int: BigInteger): string =>
  JSON.stringify(getPropsImpl(componentConfig, int))

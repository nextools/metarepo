/* eslint-disable no-use-before-define */
import { isValidElement, ReactElement, FC } from 'react'
import { isFunction, isSymbol, isUndefined, isRegExp, TAnyObject, isString, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { unpackPerm } from './unpack-perm'
import { getIndexedName } from './get-indexed-name'

const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}

const getValue = (valueIndex: number, values: any[], key: string, required?: string[]): string | undefined => {
  let index = -1

  if (isDefined(required) && required.includes(key)) {
    index = valueIndex
  } else if (valueIndex > 0) {
    index = valueIndex - 1
  }

  if (index >= 0) {
    const value = values[index]

    if (isFunction(value)) {
      return value.name === ''
        ? `[function(${index})]`
        : `[function(${value.name}) (${index})]`
    }

    if (isSymbol(value)) {
      return isUndefined(value.description)
        ? `[symbol(${index})]`
        : `[symbol(${value.description})]`
    }

    if (isRegExp(value)) {
      return `[regexp(${value}) (${index})]`
    }

    if (isValidElement(value)) {
      return `[react(${getElementName(value)}) (${index})]`
    }

    return `${value}`
  }
}

const getChildValue = (int: BigInteger, childMeta: TMetaFile, childKey: string, required?: string[]): any => {
  if (isDefined(required) && required.includes(childKey)) {
    return getPropsImpl(int, childMeta)
  }

  if (int.greater(BigInt.zero)) {
    return getPropsImpl(int.minus(BigInt.one), childMeta)
  }
}

const getPropsImpl = (int: BigInteger, metaFile: TMetaFile): TAnyObject => {
  const result: TAnyObject = {}
  const { values, propKeys } = unpackPerm(int, metaFile)

  let i = 0

  for (; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const valueIndex = values[i].toJSNumber()
    const value = getValue(valueIndex, metaFile.config.props[propKey], propKey, metaFile.config.required)

    if (isString(value)) {
      result[propKey] = value
    }
  }

  if (isDefined(metaFile.childrenConfig)) {
    const childrenMap: TAnyObject = {}
    const childrenKeys = metaFile.childrenConfig.children.sort((a, b) => a.localeCompare(b))
    let hasChildren = false

    for (; i < values.length; ++i) {
      const childIndex = i - propKeys.length
      const childKey = childrenKeys[childIndex]
      const valueIndex = values[i]
      const value = getChildValue(valueIndex, metaFile.childrenConfig.meta[childKey], childKey, metaFile.childrenConfig.required)

      if (isDefined(value)) {
        const childIndexedKey = getIndexedName(childrenKeys, childIndex)
        childrenMap[childIndexedKey] = value
        hasChildren = true
      }
    }

    if (hasChildren) {
      result.children = childrenMap
    }
  }

  return result
}

export const serializeProps = (int: BigInteger, metaFile: TMetaFile): string => JSON.stringify(getPropsImpl(int, metaFile))

/* eslint-disable no-use-before-define */
import { TAnyObject, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { unpackPerm } from './unpack-perm'
import { getIndexedName } from './get-indexed-name'
import { parseBigInt } from './parse-bigint'

const getValue = (valueIndex: number, values: any[], key: string, required?: string[]): any => {
  if (isDefined(required) && required.includes(key)) {
    return values[valueIndex]
  }

  if (valueIndex > 0) {
    return values[valueIndex - 1]
  }
}

const getChildValue = (int: BigInteger, childMeta: TMetaFile, childKey: string, required?: string[]): any => {
  if (isDefined(required) && required.includes(childKey)) {
    return getPropsImpl(int, childMeta)
  }

  if (!int.isZero()) {
    return getPropsImpl(int.minus(BigInt.one), childMeta)
  }
}

export const getPropsImpl = (int: BigInteger, metaFile: TMetaFile): TAnyObject => {
  const result: TAnyObject = {}
  const { values, propKeys } = unpackPerm(int, metaFile)

  let i = 0

  for (; i < propKeys.length; ++i) {
    const propKey = propKeys[i]
    const valueIndex = values[i]
    const value = getValue(valueIndex.toJSNumber(), metaFile.config.props[propKey], propKey, metaFile.config.required)

    if (isDefined(value)) {
      result[propKey] = value
    }
  }

  if (isDefined(metaFile.childrenConfig)) {
    const childrenMap: TAnyObject = {}
    let hasChildren = false

    for (; i < values.length; ++i) {
      const childIndex = i - propKeys.length
      const childKey = metaFile.childrenConfig.children[childIndex]
      const valueIndex = values[i]
      const value = getChildValue(valueIndex, metaFile.childrenConfig.meta[childKey], childKey, metaFile.childrenConfig.required)

      if (isDefined(value)) {
        const childIndexedKey = getIndexedName(metaFile.childrenConfig.children, childIndex)
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

export const getProps = (intStr: string, metaFile: TMetaFile): TAnyObject => {
  return getPropsImpl(parseBigInt(intStr), metaFile)
}

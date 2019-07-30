/* eslint-disable no-use-before-define */
import { TAnyObject, isUndefined } from 'tsfn'
import { TMetaFile, PermutationDecimal } from './types'
import { decimalToPerm } from './decimal-to-perm'
import { getIndexedName } from './get-indexed-name'

const getValue = (valueIndex: number, values: any[], key: string, required?: string[]): any => {
  if (!isUndefined(required) && required.includes(key)) {
    return values[valueIndex]
  } else if (valueIndex > 0) {
    return values[valueIndex - 1]
  }
}

const getChildValue = (decimal: PermutationDecimal, childMeta: TMetaFile, childKey: string, required?: string[]): any => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return getProps(decimal, childMeta)
  } else if (decimal > 0) {
    return getProps(decimal - 1n, childMeta)
  }
}

export const getProps = (decimal: PermutationDecimal, metaFile: TMetaFile): TAnyObject => {
  const propsKeys = Object.keys(metaFile.config.props)
  const result: TAnyObject = {}
  const { values } = decimalToPerm(decimal, metaFile)

  let i = 0

  for (; i < propsKeys.length; ++i) {
    const propKey = propsKeys[i]
    const valueIndex = values[i]
    const value = getValue(Number(valueIndex), metaFile.config.props[propKey], propKey, metaFile.config.required)

    if (!isUndefined(value)) {
      result[propKey] = value
    }
  }

  if (!isUndefined(metaFile.childrenConfig)) {
    const childrenMap: TAnyObject = {}
    let hasChildren = false

    for (; i < values.length; ++i) {
      const childIndex = i - propsKeys.length
      const childKey = metaFile.childrenConfig.children[childIndex]
      const valueIndex = values[i]
      const value = getChildValue(valueIndex, metaFile.childrenConfig.meta[childKey], childKey, metaFile.childrenConfig.required)

      if (!isUndefined(value)) {
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

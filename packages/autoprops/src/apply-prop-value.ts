/* eslint-disable max-params, no-use-before-define */
import { isUndefined } from 'tsfn'
import { PermutationDecimal, TMetaFile } from './types'
import { decimalToPerm } from './decimal-to-perm'
import { permToDecimal } from './perm-to-decimal'
import { getBaseName, getIndexedNameIndex } from './get-indexed-name'
import { checkAndDisableMutins, checkAndEnableMutins, checkAndDisableMutexes } from './check-mutex'

const applyChildPropValue = (decimal: PermutationDecimal, childMeta: TMetaFile, propPath: string[], propValue: any, childKey: string, required?: string[]): PermutationDecimal => {
  if (!isUndefined(required) && required.includes(childKey)) {
    return applyPropValue(decimal, childMeta, propPath, propValue)
  } else if (decimal > 0) {
    return applyPropValue(decimal - 1n, childMeta, propPath, propValue) + 1n
  }

  throw new Error(`path error: child "${childKey}" was not enabled, but path points inside it`)
}

export const applyPropValue = (decimal: PermutationDecimal, metaFile: TMetaFile, propPath: string[], propValue: any): PermutationDecimal => {
  const { values, length } = decimalToPerm(decimal, metaFile)
  const propKeys = Object.keys(metaFile.config.props)

  // check if local prop has changed
  if (propPath.length === 1) {
    const [propName] = propPath
    const propIndex = propKeys.indexOf(propName)

    // check path not found case
    if (propIndex < 0) {
      throw new Error(`prop path error: could not find prop "${propName}" following path "[${propPath}]"`)
    }

    const propValues = metaFile.config.props[propName]
    const isPropRequired = !isUndefined(metaFile.config.required) && metaFile.config.required.includes(propName)
    const propValueIndex = propValues.indexOf(propValue) + (isPropRequired ? 0 : 1)

    // check selected value = undefined
    if (propValueIndex <= 0) {
      values[propIndex] = 0n

      // check mutin
      if (!isUndefined(metaFile.config.mutin)) {
        checkAndDisableMutins(values, 0, propKeys, propName, metaFile.config.mutin)
      }

      return permToDecimal(values, length)
    }

    values[propIndex] = BigInt(propValueIndex)

    // check mutin
    if (!isUndefined(metaFile.config.mutin)) {
      checkAndEnableMutins(values, 0, propKeys, propName, metaFile.config.mutin, metaFile.config.required)
    }

    // check mutex
    if (!isUndefined(metaFile.config.mutex)) {
      checkAndDisableMutexes(values, 0, propKeys, propName, metaFile.config.mutex)
    }

    // return pack decimal
    return permToDecimal(values, length)
  }

  if (!isUndefined(metaFile.childrenConfig) && propPath[0] === 'children') {
    const childName = propPath[1]
    const childBaseName = getBaseName(childName)
    const childIndex = getIndexedNameIndex(metaFile.childrenConfig.children, childName) + propKeys.length

    if (propPath.length > 2) {
      values[childIndex] = applyChildPropValue(values[childIndex], metaFile.childrenConfig.meta[childBaseName], propPath.slice(2), propValue, childBaseName, metaFile.childrenConfig.required)

      return permToDecimal(values, length)
    }

    if (isUndefined(propValue)) {
      values[childIndex] = 0n

      if (!isUndefined(metaFile.childrenConfig.mutin)) {
        checkAndDisableMutins(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutin)
      }

      return permToDecimal(values, length)
    }

    values[childIndex] = 1n

    if (!isUndefined(metaFile.childrenConfig.mutin)) {
      checkAndEnableMutins(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutin)
    }

    if (!isUndefined(metaFile.childrenConfig.mutex)) {
      checkAndDisableMutexes(values, propKeys.length, metaFile.childrenConfig.children, childBaseName, metaFile.childrenConfig.mutex)
    }

    return permToDecimal(values, length)
  }

  throw new Error(`prop path error: incorrect path "[${propPath}]"`)
}

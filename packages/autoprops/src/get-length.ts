import { isUndefined } from 'tsfn'
import { TMetaFile } from './types'

export const getValuesLength = (length: bigint, key: string, required?: string[]): bigint => {
  return length + (isUndefined(required) || !required.includes(key) ? 1n : 0n)
}

export const getLength = (metaFile: TMetaFile): bigint => {
  let result = 1n

  for (const propKey of Object.keys(metaFile.config.props)) {
    result *= getValuesLength(BigInt(metaFile.config.props[propKey].length), propKey, metaFile.config.required)
  }

  if (!isUndefined(metaFile.childrenConfig)) {
    for (const childKey of metaFile.childrenConfig.children) {
      result *= getValuesLength(getLength(metaFile.childrenConfig.meta[childKey]), childKey, metaFile.childrenConfig.required)
    }
  }

  return result
}

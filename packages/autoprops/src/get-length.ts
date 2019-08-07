import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'

export const getValuesLength = (length: BigInteger, key: string, required?: string[]): BigInteger => {
  return length.add((isUndefined(required) || !required.includes(key) ? BigInt.one : BigInt.zero))
}

export const getLength = (metaFile: TMetaFile): BigInteger => {
  let result = BigInt.one

  for (const propKey of Object.keys(metaFile.config.props)) {
    result = result.multiply(getValuesLength(BigInt(metaFile.config.props[propKey].length), propKey, metaFile.config.required))
  }

  if (!isUndefined(metaFile.childrenConfig)) {
    for (const childKey of metaFile.childrenConfig.children) {
      result = result.multiply(getValuesLength(getLength(metaFile.childrenConfig.meta[childKey]), childKey, metaFile.childrenConfig.required))
    }
  }

  return result
}

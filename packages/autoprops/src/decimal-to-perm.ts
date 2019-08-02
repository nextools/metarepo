import { isUndefined } from 'tsfn'
import { TMetaFile, PermutationDecimal, Permutation } from './types'
import { getValuesLength, getLength } from './get-length'

export const decimalToPerm = (decimal: PermutationDecimal, metaFile: TMetaFile): Permutation => {
  const permValues: bigint[] = []
  const permLength: bigint[] = []
  let permValue = BigInt(decimal)

  for (const key of Object.keys(metaFile.config.props)) {
    const length = getValuesLength(BigInt(metaFile.config.props[key].length), key, metaFile.config.required)
    permLength.push(length)
    permValues.push(permValue % length)
    permValue = permValue / length
  }

  if (!isUndefined(metaFile.childrenConfig)) {
    for (const key of metaFile.childrenConfig.children) {
      const length = getValuesLength(getLength(metaFile.childrenConfig.meta[key]), key, metaFile.childrenConfig.required)
      permLength.push(length)
      permValues.push(permValue % length)
      permValue = permValue / length
    }
  }

  return {
    values: permValues,
    length: permLength,
  }
}

import { isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile, Permutation } from './types'
import { getValuesLength, getLength } from './get-length'
import { getPropKeys } from './get-keys'

export const unpackPerm = (int: BigInteger, metaFile: TMetaFile): Permutation => {
  const permValues: BigInteger[] = []
  const permLength: BigInteger[] = []
  const propKeys = getPropKeys(metaFile.config.props)
  let permValue = int

  for (const key of propKeys) {
    const length = getValuesLength(BigInt(metaFile.config.props[key].length), key, metaFile.config.required)
    const { quotient, remainder } = permValue.divmod(length)

    permLength.push(length)
    permValues.push(remainder)
    permValue = quotient
  }

  if (isDefined(metaFile.childrenConfig)) {
    for (const key of metaFile.childrenConfig.children) {
      const length = getValuesLength(getLength(metaFile.childrenConfig.meta[key]), key, metaFile.childrenConfig.required)
      const { quotient, remainder } = permValue.divmod(length)

      permLength.push(length)
      permValues.push(remainder)
      permValue = quotient
    }
  }

  return {
    values: permValues,
    length: permLength,
    propKeys,
  }
}

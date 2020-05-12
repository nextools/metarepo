import BigInt, { BigInteger } from 'big-integer'
import { TPermutation, TCommonComponentConfig } from './types'
import { getLength } from './get-length'
import { getPropKeys, getChildrenKeys } from './get-keys'
import { adjustLengthForOptionalProp } from './utils'

export const unpackPerm = (componentConfig: TCommonComponentConfig, int: BigInteger): TPermutation => {
  const permValues: BigInteger[] = []
  const permLength: BigInteger[] = []
  const propKeys = getPropKeys(componentConfig.props)
  let permValue = int

  for (const key of propKeys) {
    const length = adjustLengthForOptionalProp(BigInt(componentConfig.props[key]!.length), key, componentConfig.required)
    const { quotient, remainder } = permValue.divmod(length)

    permLength.push(length)
    permValues.push(remainder)
    permValue = quotient
  }

  const childrenKeys = getChildrenKeys(componentConfig)

  for (const key of childrenKeys) {
    const childConfig = componentConfig.children![key]!.config
    const length = adjustLengthForOptionalProp(getLength(childConfig), key, componentConfig.required)
    const { quotient, remainder } = permValue.divmod(length)

    permLength.push(length)
    permValues.push(remainder)
    permValue = quotient
  }

  return {
    values: permValues,
    lengths: permLength,
    propKeys,
    childrenKeys,
  }
}

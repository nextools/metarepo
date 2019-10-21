import BigInt, { BigInteger } from 'big-integer'
import { Permutation, TComponentConfig } from './types'
import { getValuesLength, getLength } from './get-length'
import { getPropKeys, getChildrenKeys } from './get-keys'

export const unpackPerm = (componentConfig: TComponentConfig, int: BigInteger): Permutation => {
  const permValues: BigInteger[] = []
  const permLength: BigInteger[] = []
  const propKeys = getPropKeys(componentConfig.props)
  let permValue = int

  for (const key of propKeys) {
    const length = getValuesLength(BigInt(componentConfig.props[key].length), key, componentConfig.required)
    const { quotient, remainder } = permValue.divmod(length)

    permLength.push(length)
    permValues.push(remainder)
    permValue = quotient
  }

  const childrenKeys = getChildrenKeys(componentConfig)

  for (const key of childrenKeys) {
    const length = getValuesLength(getLength(componentConfig.children![key].config), key, componentConfig.required)
    const { quotient, remainder } = permValue.divmod(length)

    permLength.push(length)
    permValues.push(remainder)
    permValue = quotient
  }

  return {
    values: permValues,
    length: permLength,
    propKeys,
    childrenKeys,
  }
}

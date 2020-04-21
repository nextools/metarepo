import { isUndefined, isDefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TCommonComponentConfig, TCommonRequiredConfig } from './types'

export const getValuesLength = (length: BigInteger, key: string, required?: TCommonRequiredConfig): BigInteger => {
  return length.add((isUndefined(required) || !required.includes(key) ? BigInt.one : BigInt.zero))
}

export const getLength = (componentConfig: TCommonComponentConfig): BigInteger => {
  let result = BigInt.one

  for (const propKey of Object.keys(componentConfig.props)) {
    result = result.multiply(getValuesLength(BigInt(componentConfig.props[propKey]!.length), propKey, componentConfig.required))
  }

  if (isDefined(componentConfig.children)) {
    for (const childKey of Object.keys(componentConfig.children)) {
      result = result.multiply(getValuesLength(getLength(componentConfig.children[childKey].config), childKey, componentConfig.required))
    }
  }

  return result
}

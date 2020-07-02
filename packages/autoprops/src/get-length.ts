/* eslint-disable no-use-before-define */
import BigInt, { BigInteger } from 'big-integer'
import { isDefined } from 'tsfn'
import { TCommonComponentConfig } from './types'
import { adjustLengthForOptionalProp } from './utils'

export const getLength = (componentConfig: TCommonComponentConfig): BigInteger => {
  let result = BigInt.one

  for (const propKey of Object.keys(componentConfig.props)) {
    result = result.multiply(adjustLengthForOptionalProp(BigInt(componentConfig.props[propKey]!.length), propKey, componentConfig.required))
  }

  if (isDefined(componentConfig.children)) {
    for (const childKey of Object.keys(componentConfig.children)) {
      result = result.multiply(adjustLengthForOptionalProp(getLength(componentConfig.children[childKey]!.config), childKey, componentConfig.required))
    }
  }

  return result
}

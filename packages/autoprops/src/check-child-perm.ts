import BigInt from 'big-integer'
import type { BigInteger } from 'big-integer'
import { getValidPermImpl } from './get-valid-perm'
import { skipToPerm } from './skip-to-perm'
import type { TCommonComponentConfig, TCheckPermFn } from './types'

const getValidChildPerm = (childConfig: TCommonComponentConfig, int: BigInteger, isChildRequired: boolean): BigInteger | null => {
  if (isChildRequired) {
    // no index offset needed
    return getValidPermImpl(childConfig, int)
  }

  // Offset index back and forth
  const perm = getValidPermImpl(childConfig, int.minus(BigInt.one))

  if (perm === null) {
    return perm
  }

  return perm.plus(BigInt.one)
}

export const checkChildPerm: TCheckPermFn = (values, permConfig, componentConfig) => {
  const { propKeys, childrenKeys } = permConfig

  // Have to check every child, because deps check get child into invalid state
  for (let i = propKeys.length; i < values.length; ++i) {
    const childKey = childrenKeys[i - propKeys.length]
    const isChildRequired = Boolean(componentConfig.required?.includes(childKey))

    // Skip if child is inactive
    if (values[i].isZero() && !isChildRequired) {
      continue
    }

    // Valid value guaranteed
    const childConfig = componentConfig.children![childKey]!.config
    // Validate Child Perm
    const childInt = getValidChildPerm(childConfig, values[i], isChildRequired)

    // check no valid index left
    if (childInt === null) {
      return skipToPerm(values, permConfig, i + 1)
    }

    // check no changes, perm is valid
    if (childInt.equals(values[i])) {
      continue
    }

    // perm was invalid, apply new perm
    const nextValues = values.slice()

    nextValues[i] = childInt

    return nextValues
  }

  return values
}

/* eslint-disable no-use-before-define */
import { BigInteger } from 'big-integer'
import { TCommonComponentConfig, TCheckPermFn } from './types'
import { checkChildPerm } from './check-child-perm'
import { checkChildrenRestriction } from './check-children-restriction'
import { checkMutexRestriction } from './check-mutex-restriction'
import { unpackPerm } from './unpack-perm'
import { checkDepsRestriction } from './check-deps-restriction'
import { packPerm } from './pack-perm'
import { getLength } from './get-length'

const testFns: TCheckPermFn[] = [
  checkChildPerm,
  checkDepsRestriction,
  checkChildrenRestriction,
  checkMutexRestriction,
]

const checkPerm: TCheckPermFn = (values, permConfig, componentConfig) => {
  // iterate over all test functions
  for (const fn of testFns) {
    const nextValues = fn(values, permConfig, componentConfig)

    // Test if no valid values left
    if (nextValues === null) {
      return null
    }

    // Test if return value has changed
    if (nextValues !== values) {
      // Rescheck new value
      return checkPerm(nextValues, permConfig, componentConfig)
    }
  }

  // All test functions return same value
  return values
}

export const getValidPermImpl = (componentConfig: TCommonComponentConfig, int: BigInteger): BigInteger | null => {
  // check perm overflow
  if (int.greaterOrEquals(getLength(componentConfig))) {
    return null
  }

  const perm = unpackPerm(componentConfig, int)
  const nextValues = checkPerm(perm.values, perm, componentConfig)

  // check no valid perms left
  if (nextValues === null) {
    return null
  }

  // check no changes
  if (nextValues === perm.values) {
    return int
  }

  // changes. Pack new values
  return packPerm(nextValues, perm.lengths)
}

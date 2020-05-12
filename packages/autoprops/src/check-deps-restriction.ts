import BigInt, { BigInteger } from 'big-integer'
import { TReadonly, isUndefined } from 'tsfn'
import { TPermutationConfig, TCommonComponentConfig, TCheckPermFn } from './types'
import { skipToPerm } from './skip-to-perm'
import { getPropIndex } from './utils'

const isPropActive = (propKey: string, values: readonly BigInteger[], { propKeys, childrenKeys }: TReadonly<TPermutationConfig>, { required }: TCommonComponentConfig): boolean => {
  // Find prop index
  const propIndex = getPropIndex(propKey, propKeys, childrenKeys)

  // Check first if prop was found
  return propIndex !== null && (
    // has non-Zero value index
    values[propIndex].isZero() === false ||
    // Whether prop is required is must be active
    Boolean(required?.includes(propKey))
  )
}

const getInvalidGroupName = (values: readonly BigInteger[], permConfig: TReadonly<TPermutationConfig>, componentConfig: TCommonComponentConfig): string | null => {
  // Valid config guaranteed
  const depsConfig = componentConfig.deps!

  // Test every group entry
  for (const groupName of Object.keys(depsConfig)) {
    // Check if deps Group is enabled
    if (isPropActive(groupName, values, permConfig, componentConfig) === false) {
      // The whole Group is inactive
      continue
    }

    // Found active deps Group. Now check every group member
    for (const depName of depsConfig[groupName]!) {
      // check if dep name refers to Group Key itself
      if (depName === groupName) {
        continue
      }

      if (isPropActive(depName, values, permConfig, componentConfig) === false) {
        // Found inactive Group member
        // Group is invalid
        return groupName
      }
    }

    // Group was valid, move to the next group
  }

  // No invalid deps Group found
  return null
}

export const checkDepsRestriction: TCheckPermFn = (values, permConfig, componentConfig) => {
  const { propKeys, childrenKeys } = permConfig

  // check no deps config
  if (isUndefined(componentConfig.deps)) {
    return values
  }

  const invalidDepsGroupName = getInvalidGroupName(values, permConfig, componentConfig)

  // No invalid deps group found
  if (invalidDepsGroupName === null) {
    return values
  }

  // Invalid group found
  // Index non-null value guaranteed
  const depsGroupKeyPropIndex = getPropIndex(invalidDepsGroupName, propKeys, childrenKeys)!
  const nextValues = values.slice()
  // Store prev index to pair it with current depIndex
  let prevDepIndex = 0

  // Iterate over invalid deps group
  // Deps Group valid access guaranteed
  for (const depName of componentConfig.deps[invalidDepsGroupName]!) {
    // skip if dep name refers to Group Key itself
    if (depName === invalidDepsGroupName) {
      continue
    }

    const depIndex = getPropIndex(depName, propKeys, childrenKeys)

    // Check for non-existing prop
    if (depIndex === null) {
      continue
    }

    // skip if prop is active
    if (isPropActive(depName, values, permConfig, componentConfig)) {
      continue
    }

    // check if depsGroupKeyPropIndex is not "right most case"
    if (depIndex > depsGroupKeyPropIndex) {
      return skipToPerm(values, permConfig, depsGroupKeyPropIndex + 1)
    }

    // depsGroupKeyPropIndex is "right most case"
    // Zero all values from prevIndex up to current inactive depIndex
    for (let i = prevDepIndex + 1; i < depIndex; ++i) {
      nextValues[i] = BigInt.zero
    }

    // No Int value overflow guaranteed
    // Value is inactive guaranteed
    nextValues[depIndex] = BigInt.one

    // Update prev index
    prevDepIndex = depIndex
  }

  return nextValues
}

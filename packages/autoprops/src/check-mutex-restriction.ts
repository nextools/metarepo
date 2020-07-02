/* eslint-disable max-params */
import { BigInteger } from 'big-integer'
import { TReadonly, isUndefined } from 'tsfn'
import { skipToPerm } from './skip-to-perm'
import { TPermutationConfig, TCheckPermFn } from './types'
import { getPropNameByIndex, getPropIndex } from './utils'

const isPropActive = (propKey: string, values: readonly BigInteger[], { propKeys, childrenKeys }: TReadonly<TPermutationConfig>): boolean => {
  // Find prop index
  const propIndex = getPropIndex(propKey, propKeys, childrenKeys)

  // Check first if prop was found
  return propIndex !== null &&
    // has non-Zero value index
    values[propIndex].isZero() === false
}

export const checkMutexRestriction: TCheckPermFn = (values, permConfig, componentConfig) => {
  const { propKeys, childrenKeys } = permConfig

  // check no mutex config
  if (isUndefined(componentConfig.mutex)) {
    return values
  }

  for (let i = 0; i < values.length; ++i) {
    if (values[i].isZero()) {
      continue
    }

    // Get prop name of value index
    // Valid value guaranteed
    const valuePropName = getPropNameByIndex(i, propKeys, childrenKeys)!

    // Find Group containing incremented prop
    for (const mutexGroup of componentConfig.mutex) {
      // Skip group that does not contain prop name
      if (!mutexGroup.includes(valuePropName)) {
        continue
      }

      // Go through found group, check if all values are zero
      for (const name of mutexGroup) {
        // Skip same value reference
        if (name === valuePropName) {
          continue
        }

        // Check if prop is active
        if (isPropActive(name, values, permConfig)) {
          // Found active Prop
          // Skip all values for most insignificant index
          return skipToPerm(values, permConfig, i + 1)
        }
      }
    }
  }

  // No mutex cases found
  return values
}

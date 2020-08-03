import BigInt from 'big-integer'
import { isUndefined } from 'tsfn'
import { applyEnableDeps } from './apply-enable-deps'
import type { TApplyRestrictionFn } from './types'

export const applyEnableChildren: TApplyRestrictionFn = (values, _, permConfig, componentConfig) => {
  const { propKeys, childrenKeys } = permConfig
  const { required, deps } = componentConfig

  // Skip if no children
  if (childrenKeys.length === 0) {
    return
  }

  // Skip if required does not include 'children'
  if (isUndefined(required) || !required.includes('children')) {
    return
  }

  const numProps = propKeys.length

  // Check if at least one child is active
  for (let i = 0; i < childrenKeys.length; ++i) {
    if (values[numProps + i].isZero() === false || required.includes(childrenKeys[i])) {
      // At least one child is Active
      return
    }
  }

  // All children are Inactive
  // 1. Check component has deps config
  if (isUndefined(deps)) {
    // Enable first child
    values[numProps] = BigInt.one

    return
  }

  // 2. Find child that has no deps
  const depGroupNames = Object.keys(deps)

  for (let i = 0; i < childrenKeys.length; ++i) {
    if (!depGroupNames.includes(childrenKeys[i])) {
      // Found child that has no deps
      values[numProps + i] = BigInt.one

      return
    }
  }

  // 3. Enable first child
  values[numProps] = BigInt.one
  // Enable deps of enabled child
  applyEnableDeps(values, childrenKeys[0], permConfig, componentConfig)
}


/* eslint-disable max-params */
import BigInt from 'big-integer'
import { isUndefined } from 'tsfn'
import { applyEnableDeps } from './apply-enable-deps'
import { TApplyRestrictionFn } from './types'
import { getPropIndex } from './utils'

export const applyDisableDeps: TApplyRestrictionFn = (values, propName, permConfig, componentConfig) => {
  const { deps } = componentConfig

  if (isUndefined(deps)) {
    return
  }

  for (const depsGroupName of Object.keys(deps)) {
    const depsGroup = deps[depsGroupName]!

    // Check if group contains propName
    if (!depsGroup.includes(propName)) {
      continue
    }

    // Group contains changed propName
    // Get the value index of a groupName
    const depsGroupPropIndex = getPropIndex(depsGroupName, permConfig.propKeys, permConfig.childrenKeys)

    // Check if groupName exists in values
    if (depsGroupPropIndex === null) {
      continue
    }

    const isRequired = Boolean(componentConfig.required?.includes(depsGroupName))
    const isActive = isRequired || values[depsGroupPropIndex].isZero() === false

    // Check if groupName is active
    if (!isActive) {
      continue
    }

    if (isRequired) {
      // Cannot be zeroified
      // Enable all deps again
      applyEnableDeps(values, depsGroupName, permConfig, componentConfig)

      // No need to further disable for 'propName'
      return
    }

    // Zeroify groupName value
    values[depsGroupPropIndex] = BigInt.zero
    // Recusrsively check deps for changed value
    applyDisableDeps(values, depsGroupName, permConfig, componentConfig)
  }
}

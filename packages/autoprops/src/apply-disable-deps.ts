/* eslint-disable max-params */
import BigInt from 'big-integer'
import { isUndefined } from 'tsfn'
import { TApplyRestrictionFn } from './types'
import { getPropIndex } from './utils'

export const applyDisableDeps: TApplyRestrictionFn = (values, propName, permConfig, componentConfig) => {
  const { deps } = componentConfig

  if (isUndefined(deps)) {
    return
  }

  for (const depsGroupName of Object.keys(deps)) {
    const depsGroup = deps[depsGroupName]!

    if (!depsGroup.includes(propName)) {
      continue
    }

    const propIndex = getPropIndex(depsGroupName, permConfig.propKeys, permConfig.childrenKeys)

    if (propIndex !== null && values[propIndex].isZero() === false) {
      values[propIndex] = BigInt.zero
      applyDisableDeps(values, depsGroupName, permConfig, componentConfig)
    }
  }
}

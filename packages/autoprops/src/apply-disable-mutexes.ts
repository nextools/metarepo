/* eslint-disable max-params */
import BigInt from 'big-integer'
import { isUndefined } from 'tsfn'
import { TApplyRestrictionFn } from './types'
import { getPropIndex } from './utils'

export const applyDisableMutexes: TApplyRestrictionFn = (values, propName, permConfig, componentConfig) => {
  if (isUndefined(componentConfig.mutex)) {
    return
  }

  for (const mutexGroup of componentConfig.mutex) {
    if (!mutexGroup.includes(propName)) {
      continue
    }

    for (const mutexName of mutexGroup) {
      if (mutexName === propName) {
        continue
      }

      const mutexPropIndex = getPropIndex(mutexName, permConfig.propKeys, permConfig.childrenKeys)

      if (mutexPropIndex !== null) {
        values[mutexPropIndex] = BigInt.zero
      }
    }
  }
}

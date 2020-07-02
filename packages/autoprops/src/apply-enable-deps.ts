import BigInt from 'big-integer'
import { isUndefined } from 'tsfn'
import { applyDisableMutexes } from './apply-disable-mutexes'
import { TApplyRestrictionFn } from './types'
import { getPropIndex } from './utils'

export const applyEnableDeps: TApplyRestrictionFn = (values, changedPropName, permConfig, componentConfig) => {
  const { deps, required } = componentConfig

  if (isUndefined(deps)) {
    return
  }

  const processedNames = new Set<string>()

  const run = (propName: string) => {
    processedNames.add(propName)

    const depsGroup = deps[propName]

    if (isUndefined(depsGroup)) {
      return
    }

    for (const depName of depsGroup) {
      if (processedNames.has(depName)) {
        continue
      }

      if (required?.includes(depName)) {
        run(depName)

        continue
      }

      const propIndex = getPropIndex(depName, permConfig.propKeys, permConfig.childrenKeys)

      if (propIndex !== null && values[propIndex].isZero()) {
        values[propIndex] = BigInt.one
        run(depName)
      }
    }
  }

  run(changedPropName)

  // Remove propName to skip mutexes for original prop
  processedNames.delete(changedPropName)

  // Skip mutexes for affected props
  for (const name of processedNames) {
    applyDisableMutexes(values, name, permConfig, componentConfig)
  }
}


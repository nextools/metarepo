/* eslint-disable max-params */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'
import { TMutinConfig, TRequiredConfig } from './types'

export const applyEnableMutins = (values: BigInteger[], propName: string, propKeys: readonly string[], childrenKeys: readonly string[], mutinConfig: TMutinConfig, requiredConfig?: TRequiredConfig): void => {
  let changedProps: Set<string> | null = null

  for (const mutinGroup of mutinConfig) {
    if (!mutinGroup.includes(propName)) {
      continue
    }

    for (const mutinName of mutinGroup) {
      const mutinPropIndex = propKeys.indexOf(mutinName)
      const isMutinOptional = isUndefined(requiredConfig) || !requiredConfig.includes(mutinName)

      if (mutinPropIndex >= 0) {
        if (isMutinOptional && BigInt.zero.equals(values[mutinPropIndex])) {
          values[mutinPropIndex] = BigInt.one

          if (changedProps === null) {
            changedProps = new Set()
          }

          changedProps.add(mutinName)
        }

        continue
      }

      const mutinChildIndex = childrenKeys.indexOf(mutinName)

      if (mutinChildIndex >= 0 && isMutinOptional && BigInt.zero.equals(values[mutinChildIndex + propKeys.length])) {
        values[mutinChildIndex + propKeys.length] = BigInt.one

        if (changedProps === null) {
          changedProps = new Set()
        }

        changedProps.add(mutinName)
      }
    }
  }

  if (changedProps !== null) {
    for (const name of changedProps) {
      applyEnableMutins(values, name, propKeys, childrenKeys, mutinConfig, requiredConfig)
    }
  }
}


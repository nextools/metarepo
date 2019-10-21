/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'
import { TMutinConfig } from './types'

export const applyDisableMutins = (values: BigInteger[], propName: string, propKeys: readonly string[], childrenKeys: readonly string[], mutinConfig: TMutinConfig): void => {
  let changedProps: Set<string> | null = null

  for (const mutinGroup of mutinConfig) {
    if (!mutinGroup.includes(propName)) {
      continue
    }

    for (const mutinName of mutinGroup) {
      const mutinPropIndex = propKeys.indexOf(mutinName)

      if (mutinPropIndex >= 0) {
        if (!values[mutinPropIndex].isZero()) {
          values[mutinPropIndex] = BigInt.zero

          if (changedProps === null) {
            changedProps = new Set()
          }

          changedProps.add(mutinName)
        }

        continue
      }

      const mutinChildIndex = childrenKeys.indexOf(mutinName)

      if (mutinChildIndex >= 0 && !values[mutinChildIndex + propKeys.length].isZero()) {
        values[mutinChildIndex + propKeys.length] = BigInt.zero

        if (changedProps === null) {
          changedProps = new Set()
        }

        changedProps.add(mutinName)
      }
    }
  }

  if (changedProps !== null) {
    for (const name of changedProps) {
      applyDisableMutins(values, name, propKeys, childrenKeys, mutinConfig)
    }
  }
}

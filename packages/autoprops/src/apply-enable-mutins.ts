/* eslint-disable max-params */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'

export const applyEnableMutins = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutinConfig: string[][], requiredConfig?: string[]): void => {
  let changedProps: Set<string> | null = null

  for (const mutinGroup of mutinConfig) {
    if (!mutinGroup.includes(propName)) {
      continue
    }

    for (const mutinName of mutinGroup) {
      if (mutinName === propName) {
        continue
      }

      const mutinPropIndex = propKeys.indexOf(mutinName)

      if (mutinPropIndex >= 0 && BigInt.zero.equals(values[mutinPropIndex + valuesIndexOffset]) && (isUndefined(requiredConfig) || !requiredConfig.includes(mutinName))) {
        values[mutinPropIndex + valuesIndexOffset] = BigInt.one

        if (changedProps === null) {
          changedProps = new Set()
        }

        changedProps.add(mutinName)
      }
    }
  }

  if (changedProps !== null) {
    for (const name of changedProps) {
      applyEnableMutins(values, valuesIndexOffset, propKeys, name, mutinConfig, requiredConfig)
    }
  }
}


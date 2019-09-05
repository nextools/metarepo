/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'

export const applyDisableMutins = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutinConfig: string[][]): void => {
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

      if (mutinPropIndex >= 0 && values[mutinPropIndex + valuesIndexOffset].greater(BigInt.zero)) {
        values[mutinPropIndex + valuesIndexOffset] = BigInt.zero

        if (changedProps === null) {
          changedProps = new Set()
        }

        changedProps.add(mutinName)
      }
    }
  }

  if (changedProps !== null) {
    for (const name of changedProps) {
      applyDisableMutins(values, valuesIndexOffset, propKeys, name, mutinConfig)
    }
  }
}

/* eslint-disable max-params */
import { isUndefined } from 'tsfn'
import BigInt, { BigInteger } from 'big-integer'

export const checkAndEnableMutins = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutinConfig: string[][], requiredConfig?: string[]): void => {
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
      checkAndEnableMutins(values, valuesIndexOffset, propKeys, name, mutinConfig, requiredConfig)
    }
  }
}

export const checkAndDisableMutins = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutinConfig: string[][]): void => {
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
      checkAndDisableMutins(values, valuesIndexOffset, propKeys, name, mutinConfig)
    }
  }
}

export const checkAndDisableMutexes = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutexConfig: string[][]): void => {
  for (const mutexGroup of mutexConfig) {
    if (!mutexGroup.includes(propName)) {
      continue
    }

    for (const mutexName of mutexGroup) {
      if (mutexName === propName) {
        continue
      }

      const mutexPropIndex = propKeys.indexOf(mutexName)

      if (mutexPropIndex >= 0) {
        values[mutexPropIndex + valuesIndexOffset] = BigInt.zero
      }
    }
  }
}

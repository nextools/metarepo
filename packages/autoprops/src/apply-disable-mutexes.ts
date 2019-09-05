/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'

export const applyDisableMutexes = (values: BigInteger[], valuesIndexOffset: number, propKeys: string[], propName: string, mutexConfig: string[][]): void => {
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

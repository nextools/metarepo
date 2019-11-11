/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'
import { TMutexConfig } from './types'

export const applyDisableMutexes = (values: BigInteger[], propName: string, propKeys: readonly string[], childrenKeys: readonly string[], mutexConfig: TMutexConfig): void => {
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
        values[mutexPropIndex] = BigInt.zero
        continue
      }

      const mutexChildIndex = childrenKeys.indexOf(mutexName)

      if (mutexChildIndex >= 0) {
        values[mutexChildIndex + propKeys.length] = BigInt.zero
      }
    }
  }
}

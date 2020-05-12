import BigInt, { BigInteger } from 'big-integer'
import { TReadonly } from 'tsfn'
import { TPermutationConfig, TCheckPermFn } from './types'

export const skipToPerm = (values: readonly BigInteger[], { lengths }: TReadonly<TPermutationConfig>, skipUpToIndex: number): ReturnType<TCheckPermFn> => {
  const nextValues = values.slice()
  const clampedIndex = Math.max(0, Math.min(skipUpToIndex, values.length))

  for (let i = 0; i < clampedIndex; ++i) {
    nextValues[i] = BigInt.zero
  }

  for (let i = clampedIndex; i < nextValues.length; ++i) {
    nextValues[i] = BigInt.one.plus(nextValues[i])

    if (nextValues[i].lesser(lengths[i])) {
      return nextValues
    }

    // value overflow, zero current and try next
    nextValues[i] = BigInt.zero
  }

  // all values overflow, assign length to indicate overflow
  return null
}

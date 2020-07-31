import BigInt from 'big-integer'
import type { BigInteger } from 'big-integer'

export const packPerm = (values: readonly BigInteger[], lengths: readonly BigInteger[]): BigInteger => {
  if (values.length === 0) {
    return BigInt.zero
  }

  let result = values[0]
  let multipliedLength = BigInt.one

  for (let i = 1; i < values.length; ++i) {
    multipliedLength = multipliedLength.multiply(lengths[i - 1])
    result = result.add(multipliedLength.multiply(values[i]))
  }

  return result
}

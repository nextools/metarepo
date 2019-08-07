import BigInt, { BigInteger } from 'big-integer'

export const packPerm = (values: BigInteger[], length: BigInteger[]): BigInteger => {
  let result = BigInt.zero
  let multipliedLength = BigInt.one

  for (let i = 0; i < values.length; ++i) {
    if (i > 0) {
      multipliedLength = multipliedLength.multiply(length[i - 1])
    }

    result = result.add(multipliedLength.multiply(values[i]))
  }

  return result
}

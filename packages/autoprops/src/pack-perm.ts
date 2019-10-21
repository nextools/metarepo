import BigInt, { BigInteger } from 'big-integer'

export const packPerm = (values: readonly BigInteger[], length: readonly BigInteger[]): BigInteger => {
  let result = values[0]
  let multipliedLength = BigInt.one

  for (let i = 1; i < values.length; ++i) {
    multipliedLength = multipliedLength.multiply(length[i - 1])
    result = result.add(multipliedLength.multiply(values[i]))
  }

  return result
}

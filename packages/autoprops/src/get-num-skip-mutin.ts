import BigInt, { BigInteger } from 'big-integer'
import { packPerm } from './pack-perm'

export const getNumSkipMutin = (values: BigInteger[], length: BigInteger[], mutinIndices: number[]): BigInteger => {
  let changedIndex = 0

  for (let i = 0; i < mutinIndices.length; ++i) {
    changedIndex = mutinIndices[i]

    if (values[changedIndex].greater(BigInt.zero)) {
      break
    }
  }

  if (mutinIndices[mutinIndices.length - 1] === changedIndex) {
    const nextValues = [...values]

    for (let i = 0; i < mutinIndices.length; ++i) {
      nextValues[mutinIndices[i]] = BigInt.one
    }

    const valuesInt = packPerm(values, length)
    const nextValuesInt = packPerm(nextValues, length)

    return nextValuesInt.minus(valuesInt)
  }

  let numSkip = BigInt.one

  for (let i = 0; i <= changedIndex; ++i) {
    numSkip = numSkip.multiply(length[i].minus(values[i]))
  }

  return numSkip
}

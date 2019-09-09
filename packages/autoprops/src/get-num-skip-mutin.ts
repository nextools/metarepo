/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'
import { packPerm } from './pack-perm'

const getGroupIndices = (propsKeys: string[], group: string[], indexOffset: number): number[] => {
  const result: number[] = []

  for (let i = 0; i < propsKeys.length; ++i) {
    if (group.includes(propsKeys[i])) {
      result.push(i + indexOffset)
    }
  }

  return result
}

export const getNumSkipMutin = (values: BigInteger[], length: BigInteger[], propsKeys: string[], group: string[], indexOffset: number): BigInteger => {
  const mutinIndices = getGroupIndices(propsKeys, group, indexOffset)
  let changedIndex = 0

  for (let i = 0; i < mutinIndices.length; ++i) {
    changedIndex = mutinIndices[i]

    if (!values[changedIndex].isZero()) {
      break
    }
  }

  /* special case for right-most changed index */
  if (mutinIndices[mutinIndices.length - 1] === changedIndex) {
    const nextValues = [...values]

    for (let i = 0; i < mutinIndices.length; ++i) {
      nextValues[mutinIndices[i]] = BigInt.one
    }

    const valuesInt = packPerm(values, length)
    const nextValuesInt = packPerm(nextValues, length)

    return nextValuesInt.minus(valuesInt)
  }

  /* all other cases */
  let numSkip = BigInt.one

  for (let i = 0; i <= changedIndex; ++i) {
    numSkip = numSkip.multiply(length[i].minus(values[i]))
  }

  return numSkip
}

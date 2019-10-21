/* eslint-disable max-params */
import BigInt, { BigInteger } from 'big-integer'
import { packPerm } from './pack-perm'

const getGroupIndices = (propsKeys: readonly string[], childrenKeys: readonly string[], group: readonly string[]): number[] => {
  const result: number[] = []

  for (let i = 0; i < propsKeys.length; ++i) {
    if (group.includes(propsKeys[i])) {
      result.push(i)
    }
  }

  for (let i = 0; i < childrenKeys.length; ++i) {
    if (group.includes(childrenKeys[i])) {
      result.push(i + propsKeys.length)
    }
  }

  return result
}

export const getNumSkipMutin = (values: readonly BigInteger[], length: readonly BigInteger[], propsKeys: readonly string[], childrenKeys: readonly string[], group: readonly string[]): BigInteger => {
  const mutinIndices = getGroupIndices(propsKeys, childrenKeys, group)
  let changedIndex = 0

  /* find changed value index in mutin group */
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

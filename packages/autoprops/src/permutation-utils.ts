import { Keys, LengthPermutation, Permutation, PropsWithValues, TProps } from './types'

export const getLengthPermutation = <Props extends TProps> (
  props: PropsWithValues<Props>,
  keys: Keys<Props>
): LengthPermutation<Props> => {
  return keys.map((k) => props[k].length) as LengthPermutation<Props>
}

export const getTotalPermutations = <Props extends TProps> (
  lengthPerm: LengthPermutation<Props>
): number => {
  return lengthPerm.reduce((a, b) => a * b, 1)
}

export const getMaxPermutation = <Props extends TProps> (
  lengthPerm: LengthPermutation<Props>
): Permutation<Props> => {
  return lengthPerm.map((k) => k - 1) as Permutation<Props>
}

export const getInitialPermutation = <Props extends TProps> (
  lengthPerm: LengthPermutation<Props>
): Permutation<Props> => {
  return new Array(lengthPerm.length).fill(0) as Permutation<Props>
}

export const bumpPermutation = <Props extends TProps> (lengthPerm: LengthPermutation<Props>, currentPerm: Permutation<Props>): void => {
  /* increment next digit */
  let i = 0

  for (; i < currentPerm.length; ++i) {
    if (currentPerm[i] < (lengthPerm[i] - 1)) {
      ++currentPerm[i]

      break
    } else if (i === currentPerm.length - 1) {
      throw new Error('Permutation overflow')
    }
  }

  /* reset previous digits */
  for (let k = 0; k < i; ++k) {
    currentPerm[k] = 0
  }
}

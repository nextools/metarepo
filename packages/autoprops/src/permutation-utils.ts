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

export const arePermutationsEqual = <Props extends TProps> (
  a: Permutation<Props>, b: Permutation<Props>
): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i])
}

export const bumpPermutation = <Props extends TProps> (
  lengthPerm: LengthPermutation<Props>
) => {
  /* maximum possible permutation value */
  const maxPerm = getMaxPermutation(lengthPerm)

  /* bump function */
  return (currentPerm: Permutation<Props>): void => {
    /* check permutation overflow */
    if (arePermutationsEqual(maxPerm, currentPerm)) {
      throw new Error('Permutation overflow')
    }

    /* copy current permutation */
    const nextPerm = currentPerm

    /* increment next digit */
    let i = 0

    for (; i < nextPerm.length; ++i) {
      if (nextPerm[i] < maxPerm[i]) {
        ++nextPerm[i]

        break
      }
    }

    /* reset previous digits */
    for (let k = 0; k < i; ++k) {
      nextPerm[k] = 0
    }
  }
}

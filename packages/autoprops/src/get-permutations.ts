/* eslint-disable no-loop-func */
import { Keys, MutexGroup, Permutation, PropsWithValues, TProps, MutinGroup } from './types'
import { arrayIntersect } from './array-intersect'
import {
  bumpPermutation,
  getInitialPermutation,
  getLengthPermutation,
  getTotalPermutations,
} from './permutation-utils'
import { getNumMutexesToSkip } from './get-num-mutexes-to-skip'

export const getPermutations = <Props extends TProps> (
  props: PropsWithValues<Props>,
  keys: Keys<Props>,
  mutexGroups: MutexGroup<Props>[] = [],
  mutinGroups: MutinGroup<Props>[] = []
): Permutation<Props>[] => {
  /* length permutation and total possible permutations */
  const lengthPerm = getLengthPermutation(props, keys)
  const totalPerms = getTotalPermutations(lengthPerm)

  /* bump function */
  const bump = bumpPermutation(lengthPerm)

  /* initial permutation */
  const currentPerm = getInitialPermutation(lengthPerm)

  /* iterate over all possible permutations */
  const perms = [] as Permutation<Props>[]

  const keysWithState = []

  for (let pi = 0; pi < totalPerms; ++pi) {
    /* get next permutation, skip first */
    if (pi > 0) {
      bump(currentPerm)
    }

    /* check mutex groups */
    let validPerm = true

    if (mutexGroups.length > 0 || mutinGroups.length > 0) {
      let keysWithStateLength = 0

      for (let i = 0; i < keys.length; ++i) {
        if (currentPerm[i] > 0) {
          keysWithState[keysWithStateLength++] = keys[i]
        }
      }

      for (let i = 0; i < mutexGroups.length; ++i) {
        const mutexGroup = mutexGroups[i]

        if (arrayIntersect(keysWithState, keysWithStateLength, mutexGroup, mutexGroup.length) > 1) {
          validPerm = false

          const skipMutexes = getNumMutexesToSkip(currentPerm, lengthPerm)

          if (skipMutexes > 0) {
            /* skip 1 because we are currently at it, and another 1 because for-loop will increment pi */
            pi += skipMutexes - 2
          }

          break
        }
      }

      if (validPerm) {
        for (let i = 0; i < mutinGroups.length; ++i) {
          const mutinGroup = mutinGroups[i]
          const intersect = arrayIntersect(keysWithState, keysWithStateLength, mutinGroup, mutinGroup.length)

          if (intersect !== 0 && intersect !== mutinGroup.length) {
            validPerm = false

            break
          }
        }
      }
    }

    /* push valid permutation */
    if (validPerm) {
      perms.push(currentPerm.slice() as Permutation<Props>)
    }
  }

  return perms
}

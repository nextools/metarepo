/* eslint-disable no-loop-func */
import { Keys, MutexGroup, Permutation, PropsWithValues, TProps, MutinGroup } from './types'
import { arrayIntersect } from './array-intersect'
import {
  bumpPermutation,
  getInitialPermutation,
  getLengthPermutation,
  getTotalPermutations,
} from './permutation-utils'

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
  let currentPerm = getInitialPermutation(lengthPerm)

  /* iterate over all possible permutations */
  const perms = [] as Permutation<Props>[]

  for (let pi = 0; pi < totalPerms; ++pi) {
    /* get next permutation, skip first */
    if (pi > 0) {
      currentPerm = bump(currentPerm)
    }

    /* check mutex groups */
    let validPerm = true

    if (mutexGroups.length > 0 || mutinGroups.length > 0) {
      const keysWithState = keys.filter((k, i) => currentPerm[i] > 0 && props[k][currentPerm[i]] !== undefined)

      if (mutexGroups.length > 0) {
        for (const mutexGroup of mutexGroups) {
          if (arrayIntersect(keysWithState, mutexGroup).length > 1) {
            validPerm = false

            break
          }
        }
      }

      if (mutinGroups.length > 0) {
        for (const mutinGroup of mutinGroups) {
          const intersect = arrayIntersect(keysWithState, mutinGroup)

          if (intersect.length !== 0 && intersect.length !== mutinGroup.length) {
            validPerm = false

            break
          }
        }
      }
    }

    /* push valid permutation */
    if (validPerm) {
      perms.push(currentPerm)
    }
  }

  return perms
}

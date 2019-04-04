import { Keys, Permutation, PropsWithValues, TProps } from './types'
import { getNameValueRequestParams } from './get-name-value-request-params'

export const getRequestParams = <Props extends TProps> (
  props: PropsWithValues<Props>,
  keys: Keys<Props>,
  permutations: Permutation<Props>[]
) => {
  const names = [] as string[]

  for (let pi = 0; pi < permutations.length; ++pi) {
    const perm = permutations[pi]
    const permNameChunks = [] as string[]

    for (let ki = 0; ki < keys.length; ++ki) {
      const key = keys[ki]
      const value = props[key][perm[ki]]

      if (value !== undefined) {
        permNameChunks.push(
          getNameValueRequestParams(`${key}`, value, pi)
        )
      }
    }

    const permName = permNameChunks.join('&')
    names.push(permName)
  }

  return names
}

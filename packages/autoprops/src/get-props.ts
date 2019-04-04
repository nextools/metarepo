import { Keys, Permutation, PropsWithValues, TProps } from './types'

export const getProps = <Props extends TProps> (
  props: PropsWithValues<Props>,
  keys: Keys<Props>,
  permutations: Permutation<Props>[]
): Props[] => {
  /* iterate over possible permutations */
  const generatedProps = [] as Props[]

  for (let pi = 0; pi < permutations.length; ++pi) {
    const perm = permutations[pi]

    /* generate key-value object with values from currentPerm */
    const propsObject = {} as Props

    for (let ki = 0; ki < keys.length; ++ki) {
      const key = keys[ki]
      const value = props[key][perm[ki]]

      /* add if value is not undefined */
      if (value !== undefined) {
        propsObject[key] = value
      }
    }

    generatedProps.push(propsObject)
  }

  return generatedProps
}

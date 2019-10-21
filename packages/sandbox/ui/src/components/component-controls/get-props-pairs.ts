import { isChildrenMap } from 'autoprops'
import { TAnyObject, isUndefined } from 'tsfn'

const pairs = <T extends any> (array: readonly T[]): readonly (readonly [T, T | undefined])[] =>
  array.reduce((res, value, i) => {
    if (i % 2 === 0) {
      res.push([value, array[i + 1]])
    }

    return res
  }, [] as any)

export const getPropsKeys = (props: Readonly<TAnyObject>) => {
  const { children, ...restProps } = props

  if (isUndefined(children) || (Array.isArray(children) && children.length === 0) || isChildrenMap(children[0])) {
    return Object.keys(restProps)
  }

  return [...Object.keys(restProps), 'children']
}

export const getPropPairs = (props: Readonly<TAnyObject>) => pairs(getPropsKeys(props))

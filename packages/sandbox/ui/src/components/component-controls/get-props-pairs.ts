import { isChildrenMap } from 'autoprops'
import { TAnyObject, isUndefined } from 'tsfn'

const pairs = <T extends any> (array: T[]) =>
  array.reduce((res, value, i) => {
    if (i % 2 === 0) {
      res.push([value, array[i + 1]])
    }

    return res
  }, [] as [T, T | undefined][])

export const getPropsKeys = (props: TAnyObject) => {
  const { children, ...restProps } = props

  if (isUndefined(children) || (Array.isArray(children) && children.length === 0) || isChildrenMap(children[0])) {
    return Object.keys(restProps)
  }

  return [...Object.keys(restProps), 'children']
}

export const getPropPairs = (props: TAnyObject) => pairs(getPropsKeys(props))

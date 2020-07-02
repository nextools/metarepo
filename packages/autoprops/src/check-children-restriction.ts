import { isUndefined } from 'tsfn'
import { skipToPerm } from './skip-to-perm'
import { TCheckPermFn } from './types'

export const checkChildrenRestriction: TCheckPermFn = (values, permConfig, { required }) => {
  const { propKeys, childrenKeys } = permConfig

  // check no children
  if (childrenKeys.length === 0) {
    return values
  }

  // check no children restriction
  if (isUndefined(required) || !required.includes('children')) {
    return values
  }

  const numProps = propKeys.length

  // check if at least one child is active
  for (let i = 0; i < childrenKeys.length; ++i) {
    if (values[numProps + i].isZero() === false || required.includes(childrenKeys[i])) {
      return values
    }
  }

  return skipToPerm(values, permConfig, numProps)
}

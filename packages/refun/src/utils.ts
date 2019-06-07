import { ReactElement, useEffect, useLayoutEffect, FC } from 'react'

export const getComponentName = (component: FC<any>) => {
  return component.displayName || component.name
}

export const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}

// FIXME: https://github.com/facebook/react/issues/14050
export const useEffectFn = process.env.NODE_ENV === 'test'
  ? useLayoutEffect
  /* istanbul ignore next */
  : useEffect

export const shallowEqualByKeys = <T extends {}>(a: T, b: T, keys: (keyof T)[]) => {
  if (a === b) {
    return true
  }

  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}

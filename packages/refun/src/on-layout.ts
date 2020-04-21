import { useRef, useLayoutEffect } from 'react'
import { EMPTY_OBJECT, NOOP, EMPTY_ARRAY } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const onLayout = <P extends {}> (onLayoutHandler: (props: P) => (() => void) | void, watchKeys: (keyof P)[]) =>
  (props: P): P => {
    const propsRef = useRef<P>(EMPTY_OBJECT)
    const useEffectFnRef = useRef(NOOP)
    const watchValuesRef = useRef<any>(EMPTY_ARRAY)

    if (watchValuesRef.current === EMPTY_ARRAY || !shallowEqualByKeys(propsRef.current, props, watchKeys)) {
      watchValuesRef.current = watchKeys.map((k) => props[k])
    }

    propsRef.current = props

    if (useEffectFnRef.current === NOOP) {
      useEffectFnRef.current = () => {
        return onLayoutHandler(propsRef.current)
      }
    }

    useLayoutEffect(useEffectFnRef.current, watchValuesRef.current)

    return props
  }

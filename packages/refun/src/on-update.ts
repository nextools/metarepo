import { useRef, useEffect } from 'react'
import { EMPTY_OBJECT, NOOP, EMPTY_ARRAY } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const onUpdate = <P extends {}> (onUpdateFn: (props: P) => (() => void) | void, watchKeys: (keyof P)[]) => (props: P): P => {
  const useEffectFnRef = useRef<() => void>(NOOP)
  const propsRef = useRef<P>(EMPTY_OBJECT)
  const watchValuesRef = useRef<any>(EMPTY_ARRAY)

  if (watchValuesRef.current === EMPTY_ARRAY || !shallowEqualByKeys(propsRef.current, props, watchKeys)) {
    watchValuesRef.current = watchKeys.map((k) => props[k])
  }

  if (useEffectFnRef.current === NOOP) {
    useEffectFnRef.current = () => {
      return onUpdateFn(propsRef.current)
    }
  }

  propsRef.current = props

  useEffect(useEffectFnRef.current, watchValuesRef.current)

  return props
}

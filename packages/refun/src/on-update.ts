import { useRef } from 'react'
import { UNDEFINED, EMPTY_OBJECT, NOOP } from 'tsfn'
import { shallowEqualByKeys, useEffectFn } from './utils'

export const onUpdate = <P extends {}> (onUpdateFn: (props: P) => Promise<void> | void, watchKeys: (keyof P)[]) => (props: P): P => {
  const isMountedRef = useRef(false)
  const onUpdateRef = useRef<() => void>(NOOP)
  const propsRef = useRef<P>(EMPTY_OBJECT)
  const valuesRef = useRef<any>(UNDEFINED)

  if (valuesRef.current === UNDEFINED || !shallowEqualByKeys(propsRef.current, props, watchKeys)) {
    valuesRef.current = watchKeys.map((k) => props[k])
  }

  if (onUpdateRef.current === NOOP) {
    onUpdateRef.current = () => {
      if (isMountedRef.current) {
        onUpdateFn(propsRef.current)
      }

      isMountedRef.current = true
    }
  }

  propsRef.current = props

  useEffectFn(onUpdateRef.current, valuesRef.current)

  return props
}

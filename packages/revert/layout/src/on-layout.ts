import { useRef, useLayoutEffect } from 'react'
import { EMPTY_OBJECT, NOOP } from 'tsfn'

export const onLayout = <P extends {}> (onLayoutHandler: (props: P) => void) =>
  (props: P): P => {
    const propsRef = useRef<P>(EMPTY_OBJECT)
    const useEffectFnRef = useRef(NOOP)

    propsRef.current = props

    if (useEffectFnRef.current === NOOP) {
      useEffectFnRef.current = () => {
        return onLayoutHandler(propsRef.current)
      }
    }

    useLayoutEffect(useEffectFnRef.current)

    return props
  }

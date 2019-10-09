import { useRef, useEffect } from 'react'
import { EMPTY_ARRAY, EMPTY_OBJECT, NOOP } from 'tsfn'

export const onUnmount = <P extends {}> (onUnmountFn: (props: P) => Promise<void> | void) => (props: P): P => {
  const propsRef = useRef<P>(EMPTY_OBJECT)
  const onUnmountRef = useRef<() => void>(NOOP)

  if (onUnmountRef.current === NOOP) {
    const unmountFn = () => {
      onUnmountFn(propsRef.current)
    }

    onUnmountRef.current = () => unmountFn
  }

  propsRef.current = props

  useEffect(onUnmountRef.current, EMPTY_ARRAY)

  return props
}

import { useRef } from 'react'
import { EMPTY_ARRAY, EMPTY_OBJECT, NOOP } from 'tsfn'
import { useEffectFn } from './utils'

export const onMount = <P extends {}> (onMountFn: (props: P) => Promise<void> | void) => (props: P): P => {
  const propsRef = useRef<P>(EMPTY_OBJECT)
  const onMountRef = useRef<() => void>(NOOP)

  if (onMountRef.current === NOOP) {
    onMountRef.current = () => {
      onMountFn(propsRef.current)
    }
  }

  propsRef.current = props

  useEffectFn(onMountRef.current, EMPTY_ARRAY)

  return props
}

import { useRef } from 'react'
import { EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const onChange = <P extends {}>(getFn: (props: P) => Promise<void> | void, watchKeys: (keyof P)[]) => (props: P): P => {
  const prevPropsRef = useRef<P>(EMPTY_OBJECT)

  if (prevPropsRef.current === EMPTY_OBJECT || !shallowEqualByKeys(prevPropsRef.current, props, watchKeys)) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getFn(props)
  }

  prevPropsRef.current = props

  return props
}

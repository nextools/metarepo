import { EMPTY_OBJECT } from 'tsfn'
import { useRef } from 'react'
import { shallowEqualByKeys } from './utils'

export const onChange = <P extends {}>(getFn: (props: P) => void, watchKeys: (keyof P)[]) => (props: P): P => {
  const prevProps = useRef<P>(EMPTY_OBJECT)

  if (!shallowEqualByKeys(prevProps.current, props, watchKeys)) {
    prevProps.current = props
    getFn(props)
  }

  return props
}

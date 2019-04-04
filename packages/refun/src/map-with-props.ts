import { useRef } from 'react'
import { TExtend, EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapWithProps = <P extends {}, R extends {}>(getFn: (props: P) => R) => (props: P): TExtend<P, R> => {
  return {
    ...props,
    ...getFn(props),
  }
}

export const mapWithPropsMemo = <P extends {}, R extends {}>(getFn: (props: P) => R, watchKeys: (keyof P)[]) => (props: P): TExtend<P, R> => {
  const prevProps = useRef<P>(EMPTY_OBJECT)
  const prevResult = useRef<R>(EMPTY_OBJECT)

  if (prevResult.current === EMPTY_OBJECT || !shallowEqualByKeys(prevProps.current, props, watchKeys)) {
    prevProps.current = props
    prevResult.current = getFn(props)
  }

  return {
    ...props,
    ...prevResult.current,
  }
}

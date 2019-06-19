import { useRef, useState, useLayoutEffect, Ref } from 'react'
import { EMPTY_OBJECT, TExtend3 } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapRefLayout = <P extends {}, R extends {}, RN extends string> (refName: RN, mapRefToProps: (ref: any, props: P) => R, keysToWatch: (keyof P)[]) => (props: P): TExtend3<P, R, { [k in RN]: Ref<any> }> => {
  const ref = useRef<any>(null)
  const [state, setState] = useState<R>(ref.current === null ? mapRefToProps(null, props) : EMPTY_OBJECT)

  const prevProps = useRef<P>(props)
  const prevValues = useRef(EMPTY_OBJECT)

  if (prevValues.current === EMPTY_OBJECT || !shallowEqualByKeys(prevProps.current, props, keysToWatch)) {
    prevValues.current = keysToWatch.map((key) => props[key])
  }

  prevProps.current = props

  useLayoutEffect(() => {
    if (ref.current !== null) {
      setState(mapRefToProps(ref.current, props))
    }
  }, prevValues.current)

  // FIXME https://github.com/microsoft/TypeScript/issues/13948
  // @ts-ignore
  return {
    ...props,
    ...state,
    [refName]: ref,
  }
}

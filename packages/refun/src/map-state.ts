import { useState, useRef } from 'react'
import { TExtend3, EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapState = <SN extends string, SSN extends string, P extends {}, R> (stateName: SN, stateSetterName: SSN, getValue: (props: P) => R, watchKeys: (keyof P)[]) =>
  (props: P): TExtend3<P, { [K in SN]: R }, { [K in SSN]: (arg: R | ((arg: R) => R)) => void }> => {
    const isFirstRender = useRef(true)
    const [state, setState] = useState<R>(isFirstRender.current ? getValue(props) : EMPTY_OBJECT)
    const prevProps = useRef<P>(props)

    isFirstRender.current = false

    if (!shallowEqualByKeys(prevProps.current, props, watchKeys)) {
      prevProps.current = props
      setState(getValue(props))
    }

    return {
      ...props,
      [stateName]: state,
      [stateSetterName]: setState,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }

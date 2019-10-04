import { useState, useRef } from 'react'
import { TExtend3, EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapState = <SN extends string, SSN extends string, P extends {}, R> (stateName: SN, stateSetterName: SSN, getValue: (props: P) => R, watchKeys: (keyof P)[]) =>
  (props: P): TExtend3<P, { [K in SN]: R }, { [K in SSN]: (arg: R) => void }> => {
    const prevProps = useRef<P>(EMPTY_OBJECT)
    const [state, setState] = useState<R>(prevProps.current === EMPTY_OBJECT ? getValue(props) : EMPTY_OBJECT)

    if (prevProps.current !== EMPTY_OBJECT && !shallowEqualByKeys(prevProps.current, props, watchKeys)) {
      setState(getValue(props))
    }

    prevProps.current = props

    return {
      ...props,
      [stateName]: state,
      [stateSetterName]: setState,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }

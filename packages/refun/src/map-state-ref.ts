import { useState, useRef, MutableRefObject } from 'react'
import { TExtend3, EMPTY_OBJECT, UNDEFINED } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapStateRef = <SN extends string, SSN extends string, P extends {}, R> (stateName: SN, stateFlusherName: SSN, getValue: (props: P) => R, watchKeys: (keyof P)[]) =>
  (props: P): TExtend3<P, { [K in SN]: MutableRefObject<R> }, { [K in SSN]: () => void }> => {
    const isFirstRender = useRef(true)
    const useStateResult = useState(UNDEFINED)
    const stateRef = useRef<R>(isFirstRender.current ? getValue(props) : EMPTY_OBJECT)
    const prevProps = useRef<P>(props)

    isFirstRender.current = false

    if (!shallowEqualByKeys(prevProps.current, props, watchKeys)) {
      prevProps.current = props
      stateRef.current = getValue(props)
    }

    return {
      ...props,
      [stateName]: stateRef,
      [stateFlusherName]: useStateResult[1],
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }

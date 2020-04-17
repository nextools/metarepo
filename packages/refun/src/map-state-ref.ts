import { useState, useRef, MutableRefObject } from 'react'
import { TExtend3, EMPTY_OBJECT, NOOP } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapStateRef = <SN extends string, SSN extends string, P extends {}, R> (stateName: SN, stateFlusherName: SSN, getValue: (props: P) => R, watchKeys: (keyof P)[]) =>
  (props: P): TExtend3<P, { [K in SN]: MutableRefObject<R> }, { [K in SSN]: () => void }> => {
    const useStateResult = useState<R>(EMPTY_OBJECT)
    const prevProps = useRef<P>(EMPTY_OBJECT)
    const stateRef = useRef<R>(EMPTY_OBJECT)
    const stateFlushRef = useRef(NOOP)

    if (stateFlushRef.current === NOOP) {
      stateFlushRef.current = () => {
        useStateResult[1]({} as R)
      }
    }

    if (prevProps.current === EMPTY_OBJECT || !shallowEqualByKeys(prevProps.current, props, watchKeys)) {
      stateRef.current = getValue(props)
    }

    prevProps.current = props

    return {
      ...props,
      [stateName]: stateRef,
      [stateFlusherName]: stateFlushRef.current,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }

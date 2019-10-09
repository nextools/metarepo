import { useRef, useState, useLayoutEffect, Ref } from 'react'
import { EMPTY_OBJECT, TExtend3, NOOP } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapRefLayout = <P extends {}, R extends {}, RN extends string> (refName: RN, mapRefToProps: (ref: any, props: P) => R, keysToWatch: (keyof P)[]) =>
  (props: P): TExtend3<P, R, { [k in RN]: Ref<any> }> => {
    const ref = useRef<any>(null)
    const prevPropsRef = useRef<P>(EMPTY_OBJECT)
    const prevWatchValuesRef = useRef(EMPTY_OBJECT)
    const useEffectFnRef = useRef(NOOP)
    const [state, setState] = useState<R>(useEffectFnRef.current === NOOP ? mapRefToProps(null, props) : EMPTY_OBJECT)

    if (prevWatchValuesRef.current === EMPTY_OBJECT || !shallowEqualByKeys(prevPropsRef.current, props, keysToWatch)) {
      prevWatchValuesRef.current = keysToWatch.map((key) => props[key])
    }

    prevPropsRef.current = props

    if (useEffectFnRef.current === NOOP) {
      useEffectFnRef.current = () => {
        if (ref.current !== null) {
          setState(mapRefToProps(ref.current, prevPropsRef.current))
        }
      }
    }

    useLayoutEffect(useEffectFnRef.current, prevWatchValuesRef.current)

    // FIXME https://github.com/microsoft/TypeScript/issues/13948
    // @ts-ignore
    return {
      ...props,
      ...state,
      [refName]: ref,
    }
  }

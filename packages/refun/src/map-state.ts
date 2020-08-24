import { useState, useRef } from 'react'
import { EMPTY_OBJECT } from 'tsfn'
import type { TExtend3 } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapState = <SN extends string, SSN extends string, P extends {}, R> (stateName: SN, stateSetterName: SSN, getValue: (props: P) => R, watchKeys: (keyof P)[]) =>
  (props: P): TExtend3<P, { [K in SN]: R }, { [K in SSN]: (arg: R) => void }> => {
    const prevProps = useRef<P>(EMPTY_OBJECT)
    const [state, setState] = useState<R>(prevProps.current === EMPTY_OBJECT ? getValue(props) : EMPTY_OBJECT)

    let nextState = state

    if (prevProps.current !== EMPTY_OBJECT && !shallowEqualByKeys(prevProps.current, props, watchKeys)) {
      // React will continue current render, delivering 'state', which is already old state.
      // By assigning to 'nextState', we deliver fresh state during current render.
      // After that React will rerender due to actual 'setState', delivering same state value.
      nextState = getValue(props)

      // React prevents rerender by setState if next value is the same as current state.
      // But in this case, setState is triggered during the render phase.
      // React does not interrupt render, and lets the component to render till the end,
      // and after that initiates next render caused by this setState.
      // Manually checking for equality to prevent unnecessary rerender.
      if (nextState !== state) {
        setState(nextState)
      }
    }

    prevProps.current = props

    return {
      ...props,
      [stateName]: nextState,
      [stateSetterName]: setState,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }

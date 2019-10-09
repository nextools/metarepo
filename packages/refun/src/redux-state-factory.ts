import { useContext, Context, useRef } from 'react'
import { Dispatch } from 'redux'
import { EMPTY_OBJECT, TExtend } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export type TStoreContextValue<S, D extends Dispatch> = {
  state: S,
  dispatch: D,
}

export const ReduxStateFactory = <S, D extends Dispatch>(context: Context<{state: S, dispatch: D}>) => <P extends {}, SP extends {}>(mapStateToProps: (state: S) => SP, stateKeysToWatch: (keyof S)[]) =>
  (props: P): TExtend<P, SP> => {
    const prevStateRef = useRef<S>(EMPTY_OBJECT)
    const prevStatePropsRef = useRef<SP>(EMPTY_OBJECT)
    const { state } = useContext(context)

    if (prevStatePropsRef.current === EMPTY_OBJECT || !shallowEqualByKeys(prevStateRef.current, state, stateKeysToWatch)) {
      prevStatePropsRef.current = mapStateToProps(state)
    }

    prevStateRef.current = state

    return {
      ...props,
      ...prevStatePropsRef.current,
    }
  }

import { useContext, Context, useRef } from 'react'
import { Dispatch } from 'redux' // eslint-disable-line import/named
import { EMPTY_OBJECT, TExtend } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export type TStoreContextValue<S> = {
  state: S,
  dispatch: Dispatch
}

export const mapReduxState = <S>(context: Context<TStoreContextValue<S>>) => <P extends {}, SP extends {}>(mapStateToProps: (state: S) => SP, stateKeysToWatch: (keyof S)[]) =>
  (props: P): TExtend<P, SP> => {
    const prevState = useRef<S>(EMPTY_OBJECT)
    const prevStateProps = useRef<SP>(EMPTY_OBJECT)
    const { state } = useContext(context)

    if (!shallowEqualByKeys(prevState.current, state, stateKeysToWatch)) {
      prevStateProps.current = mapStateToProps(state)
    }

    prevState.current = state

    return {
      ...props,
      ...prevStateProps.current,
    }
  }

export const mapReduxDispatch = (context: Context<TStoreContextValue<any>>) => <P extends {}>(props: P): TExtend<P, { dispatch: Dispatch }> => {
    const { dispatch } = useContext(context)

    return {
      ...props,
      dispatch,
    }
  }

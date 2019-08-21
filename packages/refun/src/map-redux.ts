import { useContext, Context, useRef } from 'react'
import { Dispatch } from 'redux' // eslint-disable-line import/named
import { EMPTY_OBJECT, TExtend } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export type TStoreContextValue<S, D extends Dispatch> = {
  state: S,
  dispatch: D,
}

export const mapReduxState = <S, D extends Dispatch>(context: Context<TStoreContextValue<S, D>>) => <P extends {}, SP extends {}>(mapStateToProps: (state: S) => SP, stateKeysToWatch: (keyof S)[]) =>
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

export const mapReduxDispatch = <S, D extends Dispatch>(context: Context<TStoreContextValue<S, D>>) => <P extends {}>(props: P): TExtend<P, { dispatch: D }> => {
  const { dispatch } = useContext(context)

  return {
    ...props,
    dispatch,
  }
}

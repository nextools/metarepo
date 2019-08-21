import React, { createContext } from 'react'
import { Store, AnyAction, Dispatch } from 'redux' // eslint-disable-line
import { component } from './component'
import { mapState } from './map-state'
import { onMount } from './on-mount'
import { mapReduxState, mapReduxDispatch, TStoreContextValue } from './map-redux'

export const StoreContextFactory = <S extends {}, D extends Dispatch> (store: Store<S>) => {
  const Context = createContext<TStoreContextValue<S, D>>({
    state: store.getState(),
    dispatch: store.dispatch as D,
  })

  const StoreProvider = component(
    mapState('value', 'setValue', () => ({
      state: store.getState(),
      dispatch: store.dispatch as D,
    }), []),
    onMount(({ setValue }) => {
      const state = store.getState()

      if (state !== null) {
        setValue({
          state,
          dispatch: store.dispatch as D,
        })
      }

      return store.subscribe(() => {
        setValue({
          state: store.getState(),
          dispatch: store.dispatch as D,
        })
      })
    })
  )(({ value, children }) => (
    <Context.Provider value={value}>
      {value.state === null ? null : children}
    </Context.Provider>
  ))

  const mapStoreState = mapReduxState<S, D>(Context)
  const mapStoreDispatch = mapReduxDispatch<S, D>(Context)

  StoreProvider.displayName = 'StoreProvider'

  return {
    StoreProvider,
    mapStoreState,
    mapStoreDispatch,
  }
}


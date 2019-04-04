import React, { createContext } from 'react'
import { Store } from 'redux' // eslint-disable-line
import { component } from './component'
import { mapState } from './map-state'
import { onMount } from './on-mount'
import { mapReduxState, mapReduxDispatch, TStoreContextValue } from './map-redux'

export const StoreContextFactory = <T extends {}> (store: Store<T>) => {
  const Context = createContext<TStoreContextValue<T>>({
    state: store.getState(),
    dispatch: store.dispatch,
  })

  const StoreProvider = component(
    mapState('value', 'setValue', () => ({
      state: store.getState(),
      dispatch: store.dispatch,
    }), []),
    onMount(({ setValue }) => {
      const state = store.getState()

      if (state !== null) {
        setValue({
          state,
          dispatch: store.dispatch,
        })
      }

      return store.subscribe(() => {
        setValue({
          state: store.getState(),
          dispatch: store.dispatch,
        })
      })
    })
  )('StoreProvider', ({ value, children }) => (
    <Context.Provider value={value}>
      {value.state === null ? null : children}
    </Context.Provider>
  ))

  const mapStoreState = mapReduxState(Context)
  const mapStoreDispatch = mapReduxDispatch(Context)

  return {
    StoreProvider,
    mapStoreState,
    mapStoreDispatch,
  }
}


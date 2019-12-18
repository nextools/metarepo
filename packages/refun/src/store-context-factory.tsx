import React, { createContext } from 'react'
import { Store, Dispatch } from 'redux'
import { component } from './component'
import { mapState } from './map-state'
import { onMountUnmount } from './on-mount-unmount'
import { ReduxStateFactory, TStoreContextValue } from './redux-state-factory'
import { ReduxDispatchFactory } from './redux-dispatch-factory'

export const StoreContextFactory = <S extends {}, D extends Dispatch> (store: Store<S>) => {
  const getStateAndDispatch = () => ({
    state: store.getState(),
    dispatch: store.dispatch as D,
  })
  const Context = createContext<TStoreContextValue<S, D>>({} as any)

  const StoreProvider = component(
    mapState('value', 'setValue', getStateAndDispatch, []),
    onMountUnmount(({ setValue }) => store.subscribe(() => {
      setValue(getStateAndDispatch())
    }))
  )(({ value, children }) => (
    <Context.Provider value={value}>
      {value.state === null ? null : children}
    </Context.Provider>
  ))

  StoreProvider.displayName = 'StoreProvider'

  return {
    Context,
    StoreProvider,
    mapStoreState: ReduxStateFactory<S, D>(Context),
    mapStoreDispatch: ReduxDispatchFactory<S, D>(Context),
  }
}


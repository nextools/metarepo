import { createContext } from 'react'
import type { Store } from 'redux'
import { ReduxDispatchFactory } from './redux-dispatch-factory'
import { ReduxStateFactory } from './redux-state-factory'

export const StoreContextFactory = <STORE extends Store> (store: STORE) => {
  const Context = createContext(store)

  return {
    Context,
    mapStoreState: ReduxStateFactory<ReturnType<STORE['getState']>>(Context as any),
    mapStoreDispatch: ReduxDispatchFactory<STORE>(Context),
  }
}


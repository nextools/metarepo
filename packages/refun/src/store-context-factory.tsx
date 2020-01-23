import { createContext } from 'react'
import { Store } from 'redux'
import { ReduxStateFactory } from './redux-state-factory'
import { ReduxDispatchFactory } from './redux-dispatch-factory'

export const StoreContextFactory = <STORE extends Store> (store: STORE) => {
  const Context = createContext(store)

  return {
    Context,
    mapStoreState: ReduxStateFactory<ReturnType<STORE['getState']>>(Context as any),
    mapStoreDispatch: ReduxDispatchFactory<STORE>(Context),
  }
}


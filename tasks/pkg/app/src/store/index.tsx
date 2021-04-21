import type { FC } from 'react'
import { StoreContextFactory } from 'refun'
import { store } from './store'

const StoreContext = StoreContextFactory(store)

export const StoreProvider: FC<{}> = ({ children }) => (
  <StoreContext.Context.Provider value={store}>
    {children}
  </StoreContext.Context.Provider>
)
export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

import { createStore, applyMiddleware, Store, compose } from 'redux'
import { StoreContextFactory } from 'refun'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { reducer } from '../reducers'
import { TState, TAnyAction } from '../types'

const composeWithDevTools = (global as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store: Store<TState> = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

const StoreContext = StoreContextFactory<TState, ThunkDispatch<TState, any, TAnyAction>>(store)

export const StoreProvider = StoreContext.StoreProvider
export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

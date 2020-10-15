import { createStore, applyMiddleware, compose } from 'redux'
import type { AnyAction } from 'redux'
import thunk from 'redux-thunk'
import type { ThunkDispatch } from 'redux-thunk'
import { StoreContextFactory } from 'refun'
import { reducer } from '../reducers'
import type { TState } from '../types'

const composeWithDevTools: typeof compose = (global as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose

export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware<ThunkDispatch<TState, undefined, AnyAction>, TState>(thunk)
  )
)

const StoreContext = StoreContextFactory(store)

export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

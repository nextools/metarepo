import { createStore, applyMiddleware, compose, AnyAction } from 'redux'
import { StoreContextFactory } from 'refun'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { reducer } from '../reducers'
import { TState } from '../types'

const composeWithDevTools: typeof compose = (global as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware<ThunkDispatch<TState, undefined, AnyAction>, TState>(thunk)
  )
)

const StoreContext = StoreContextFactory(store)

export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

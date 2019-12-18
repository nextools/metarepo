import { Store, createStore, applyMiddleware } from 'redux'
import { TState } from './types'
import { reducer } from './reducers'
import { getInitialState } from './initial-state'
import { syncState } from './middlewares'

export const store: Store<TState> = createStore(
  reducer,
  getInitialState(),
  applyMiddleware(syncState)
)

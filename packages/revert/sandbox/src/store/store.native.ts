import { applyMiddleware, createStore } from 'redux'
import type { Store } from 'redux'
import thunk from 'redux-thunk'
import { reducer } from './reducers'
import type { TDispatch, TState } from './types'

export const store: Store<TState> = createStore(
  reducer,
  applyMiddleware<TDispatch, TState>(thunk)
)

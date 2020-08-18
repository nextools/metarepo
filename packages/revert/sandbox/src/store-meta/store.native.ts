import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer } from './reducers'
import type { TMetaState, TMetaDispatch } from './types'

export const store = createStore(
  reducer,
  applyMiddleware<TMetaDispatch, TMetaState>(thunk)
)

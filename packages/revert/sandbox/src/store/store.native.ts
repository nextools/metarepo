import { createStore } from 'redux'
import type { Store } from 'redux'
import { reducer } from './reducers'
import type { TState } from './types'

export const store: Store<TState> = createStore(
  reducer
)

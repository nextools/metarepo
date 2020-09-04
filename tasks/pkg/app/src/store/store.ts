import { createStore } from 'redux'
import type { Store } from 'redux'
import { reducer } from '../reducers'
import type { TState } from '../types'

export let store: Store<TState>

if (process.env.NODE_ENV === 'development') {
  store = createStore(reducer, (global as any)?.__REDUX_DEVTOOLS_EXTENSION__())
} else {
  store = createStore(reducer)
}

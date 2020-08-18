import { createStore } from 'redux'
import type { Store } from 'redux'
import { globalObject } from '../utils'
import { getHashInitialState } from './get-hash-initial-state'
import { reducer } from './reducers'
import type { TState } from './types'

export let store: Store<TState>

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    reducer,
    globalObject.__REDUX_DEVTOOLS_EXTENSION__ && globalObject.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  store = createStore(
    reducer,
    getHashInitialState()
  )
}

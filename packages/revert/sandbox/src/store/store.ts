import { applyMiddleware, compose, createStore } from 'redux'
import type { Store } from 'redux'
import thunk from 'redux-thunk'
import { globalObject } from '../utils'
import { getHashInitialState } from './get-hash-initial-state'
import { reducer } from './reducers'
import type { TDispatch, TState } from './types'

export let store: Store<TState> & {
  dispatch: TDispatch,
}

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  const composeWithDevTools: typeof compose = globalObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose

  store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware<TDispatch, TState>(thunk)
    )
  )
} else {
  store = createStore(
    reducer,
    getHashInitialState(),
    applyMiddleware<TDispatch, TState>(thunk)
  )
}

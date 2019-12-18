import { Store, compose, createStore, applyMiddleware } from 'redux'
import { globalObject } from '../utils'
import { TState } from './types'
import { reducer } from './reducers'
import { locationHash, syncState } from './middlewares'
import { getInitialState } from './initial-state'

export let store: Store<TState>

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  const composeWithDevTools: typeof compose = globalObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(locationHash, syncState)
    )
  )
} else {
  store = createStore(
    reducer,
    getInitialState(),
    applyMiddleware(locationHash)
  )
}

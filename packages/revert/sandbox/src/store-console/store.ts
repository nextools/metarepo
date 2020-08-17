import { createStore } from 'redux'
import type { Store } from 'redux'
import { globalObject } from '../utils'
import { reducer } from './reducers'
import type { TConsoleState } from './types'

export let store: Store<TConsoleState>

if (process.env.NODE_ENV === 'development') {
  store = createStore(
    reducer,
    globalObject.__REDUX_DEVTOOLS_EXTENSION__?.()
  )
} else {
  store = createStore(reducer)
}

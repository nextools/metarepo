import { createStore, applyMiddleware, Store, compose } from 'redux'
import { StoreContextFactory } from 'refun'
import { reducer } from '../reducers'
import { locationHash, syncState } from '../middlewares'
import { TState } from '../types'
import { getInitialState } from './get-initial-state'

const composeWithDevTools = (global as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export let store: Store<TState>

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(locationHash, syncState)
    )
  )

  // if (module.hot) {
  //   module.hot.accept('../reducers', () => {
  //     store.replaceReducer(reducer)
  //   })

  //   module.hot.accept('./initial-state.ts', () => {
  //     store.dispatch({
  //       type: 'NAVIGATE',
  //       payload: null,
  //     })
  //   })
  // }
} else {
  store = createStore(reducer, getInitialState(), applyMiddleware(locationHash))
}

const StoreContext = StoreContextFactory(store)

export const StoreProvider = StoreContext.StoreProvider
export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

import type { AnyAction, Reducer, Store } from 'redux'
import { ReduxStateFactory, ReduxDispatchFactory } from 'refun'

export const injectReducerFactory = <S extends {}, A extends AnyAction>(store: Store<S>, reducer: Reducer<S, A>, StoreContext: any) => <SS extends {}, AA extends AnyAction>(injectedReducer: Reducer<SS, AA>) => {
  store.replaceReducer(
    (state: any, action: any) => injectedReducer(reducer(state, action) as any, action) as any
  )

  return {
    mapStoreState: ReduxStateFactory<SS & S>(StoreContext),
    mapStoreDispatch: ReduxDispatchFactory<Store<SS & S>>(StoreContext),
  }
}

import { StoreContextFactory } from 'refun'
import type { TComponents } from '../types'
import { setComponentListThunk, applyPropPathValue, updateComponentPropsThunk, setComponentThunk, selectElementAction } from './actions'
import { store } from './store'
import type { TMetaState } from './types'

export const mapMetaStoreState = StoreContextFactory(store).mapStoreState

export const setComponentsList = (components: TComponents) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(setComponentListThunk(components))
}

export const updateComponentProps = (componentKey: string | null, propsIndex: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return store.dispatch(updateComponentPropsThunk(componentKey, propsIndex))
}

export const setComponentKey = (componentKey: string) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(setComponentThunk(componentKey))
}

export const applyPropValue = (propPath: string[], propValue: any) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.dispatch(applyPropPathValue(propPath, propValue))
}

export const selectElement = (payload: TMetaState['selectedElementPath']) => {
  store.dispatch(selectElementAction({ selectedElementPath: payload }))
}

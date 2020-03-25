import { StoreContextFactory } from 'refun'
import { storeSubscribe } from '../store'
import { TComponents } from '../types'
import { setComponentListThunk, updateComponentPropsThunk } from './actions'
import { store } from './store'

storeSubscribe(['componentKey', 'selectedSetIndex'], async ({ componentKey, selectedSetIndex }) => {
  await store.dispatch(updateComponentPropsThunk(componentKey, selectedSetIndex))
})

export const mapMetaStoreState = StoreContextFactory(store).mapStoreState

export const setComponentsList = async (components: TComponents) => {
  await store.dispatch(setComponentListThunk(components))
}

import { StoreContextFactory } from 'refun'
import { consoleLogAction, consoleClearAction } from './actions'
import { store } from './store'

export const mapConsoleStoreState = StoreContextFactory(store).mapStoreState

export const consoleLog = (message: string) => {
  store.dispatch(consoleLogAction(message))
}

export const consoleClear = () => {
  store.dispatch(consoleClearAction())
}

import { StoreContextFactory } from 'refun'
import { store } from './store'
import { consoleLogAction, consoleClearAction } from './actions'

export const mapConsoleStoreState = StoreContextFactory(store).mapStoreState

export const consoleLog = (message: string) => {
  store.dispatch(consoleLogAction(message))
}

export const consoleClear = () => {
  store.dispatch(consoleClearAction())
}

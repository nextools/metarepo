import { store as mainStore } from '../store/store'
import { SyncStoreFactory } from './store'
import { syncState } from './sync-state'

const store = SyncStoreFactory(mainStore, metaStore)

// Activate middlewares
if (process.env.NODE_ENV === 'development') {
  syncState(store)
}

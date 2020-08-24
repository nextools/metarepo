import { getHashState as getSyncHashState } from '../store-sync/get-hash-state'
import { pickMainSubState } from '../store-sync/get-initial-sync-state'
import { isValidSyncState } from '../store-sync/is-valid-sync-state'
import { initialState } from './initial-state'
import type { TState } from './types'

export const getHashInitialState = (): TState => {
  const stateObj = getSyncHashState()

  if (isValidSyncState(stateObj)) {
    return {
      ...initialState,
      ...pickMainSubState(stateObj),
    }
  }

  return initialState
}

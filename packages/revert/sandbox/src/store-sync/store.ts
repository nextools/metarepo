import type { Store } from 'redux'
import { shallowEqualByKeys } from 'refun'
import { navigate } from '../store'
import { updateComponentProps } from '../store-meta'
import type { TMetaState } from '../store-meta/types'
import type { TState as TMainState } from '../store/types'
import { objectPick } from '../utils/object-pick'
import { mainStateKeys, metaStateKeys } from './get-initial-sync-state'
import { isValidSyncState } from './is-valid-sync-state'
import type { TSyncStore, TMainSubState, TMetaSubState, TSyncState } from './types'

export const SyncStoreFactory = (mainStore: Store<TMainState>, metaStore: Store<TMetaState>): TSyncStore => {
  let mainKnownState: TMainSubState = objectPick(mainStore.getState(), mainStateKeys)
  let metaKnownState: TMetaSubState = objectPick(metaStore.getState(), metaStateKeys)
  let isMainStateUpdating = false
  let isMetaStateUpdating = false
  const subscribers: Set<(state: TSyncState) => void> = new Set()

  const callSubscribers = (state: TSyncState) => {
    for (const sub of subscribers) {
      sub(state)
    }
  }

  // Subscribe to Main Store
  mainStore.subscribe(() => {
    // Do not invoke subscribers
    if (isMainStateUpdating) {
      return
    }

    // Update is coming from a Store.
    const state = objectPick(mainStore.getState(), mainStateKeys)

    if (shallowEqualByKeys(mainKnownState, state, mainStateKeys)) {
      return
    }

    mainKnownState = state

    callSubscribers({
      ...state,
      ...metaKnownState,
    })
  })
  // Subscribe to Meta Store
  metaStore.subscribe(() => {
    // Do not invoke subscribers
    if (isMetaStateUpdating) {
      return
    }

    // Update is coming from a Store.
    const state = objectPick(metaStore.getState(), metaStateKeys)

    if (shallowEqualByKeys(metaKnownState, state, metaStateKeys)) {
      return
    }

    metaKnownState = state

    callSubscribers({
      ...mainKnownState,
      ...state,
    })
  })

  return {
    setState: async (incoming: unknown) => {
      // Incoming could be invalid, because of broken url hash
      if (!isValidSyncState(incoming)) {
        return
      }

      // Check if mainState should be updated
      const incomingMainState = objectPick(incoming, mainStateKeys)

      if (!shallowEqualByKeys(incomingMainState, mainKnownState, mainStateKeys)) {
        mainKnownState = incomingMainState

        isMainStateUpdating = true
        navigate(incomingMainState)
        isMainStateUpdating = false
      }

      // Check if metaState should be updated
      const incomingMetaState = objectPick(incoming, metaStateKeys)

      if (!shallowEqualByKeys(incomingMetaState, metaKnownState, metaStateKeys)) {
        metaKnownState = incomingMetaState

        isMetaStateUpdating = true
        await updateComponentProps(incomingMetaState.componentKey, incomingMetaState.propsIndex)
        isMetaStateUpdating = false
      }
    },
    subscribe: (observer: (state: TSyncState) => void) => {
      subscribers.add(observer)
    },
  }
}

import { platformId } from '../utils/platform-id'
import { getInitialSyncState } from './get-initial-sync-state'
import type { TSyncStore } from './types'

const HOST = 'localhost'
const PORT = 3001
const ACTION_TYPE_HANDSHAKE = 'HANDSHAKE'
const ACTION_TYPE_SYNC = 'SYNC'

export const syncState = (store: TSyncStore) => {
  const ws = new WebSocket(`ws://${HOST}:${PORT}/`)

  ws.addEventListener('open', () => {
    ws.send(
      JSON.stringify({
        type: ACTION_TYPE_HANDSHAKE,
        payload: platformId,
      })
    )
  })

  ws.addEventListener('message', ({ data }) => {
    const { type, payload } = JSON.parse(data)

    if (type === ACTION_TYPE_SYNC) {
      store.setState(
        payload !== null
          ? payload
          : getInitialSyncState()
      )
    }
  })

  store.subscribe((nextState) => {
    if (ws.readyState === 0) {
      return
    }

    ws.send(
      JSON.stringify({
        type: ACTION_TYPE_SYNC,
        payload: nextState,
      })
    )
  })
}

import { Middleware } from 'redux'
import { platformId } from '../utils/platform-id'
import { navigate, isNavigateAction } from '../actions'
import { getInitialState } from '../store/get-initial-state'

const HOST = 'localhost'
const PORT = 3001
const ACTION_TYPE_HANDSHAKE = 'HANDSHAKE'
const ACTION_TYPE_SYNC = 'SYNC'

export const syncState: Middleware = (store) => {
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
      if (payload === null) {
        const state = getInitialState()

        store.dispatch(navigate(state))

        ws.send(
          JSON.stringify({
            type: ACTION_TYPE_SYNC,
            payload: state,
          })
        )
      } else {
        store.dispatch(navigate(payload))
      }
    }
  })

  return (next) => (action) => {
    const result = next(action)

    if (ws.readyState !== 0 && !isNavigateAction(action)) {
      ws.send(
        JSON.stringify({
          type: ACTION_TYPE_SYNC,
          payload: store.getState(),
        })
      )
    }

    return result
  }
}

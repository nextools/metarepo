import { TState } from '../types'
import { decodeUrl, getCurrentHash } from '../utils'
import { state } from './initial-state'

export const getInitialState = (): TState => {
  const currentHash = getCurrentHash()

  if (currentHash !== null) {
    const decoded = decodeUrl(currentHash)

    if (decoded !== null) {
      return {
        ...state,
        ...decoded,
      } as TState
    }
  }

  return state
}

import { getCurrentHash, decodeUrl } from '../utils'
import { TState } from '../types'
import { initialState } from './initial-state'

export const getInitialState = (): TState => {
  const currentHash = getCurrentHash()

  if (currentHash !== null) {
    const decoded = decodeUrl(currentHash)

    if (decoded !== null) {
      return {
        ...initialState,
        ...decoded,
      } as TState
    }
  }

  return initialState
}

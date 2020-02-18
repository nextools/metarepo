import { Middleware } from 'redux'
import { TState } from '../types'
import { navigateAction } from '../actions'
import { globalObject } from '../../utils'
import { getCurrentHash, decodeUrl, encodeUrl, setCurrentHash } from '../utils'

export const locationHash: Middleware = (store) => {
  let prevHash: string

  globalObject.addEventListener('hashchange', () => {
    const currentHash = getCurrentHash()

    if (currentHash !== null && currentHash !== prevHash) {
      const decoded = decodeUrl(currentHash)

      if (decoded !== null) {
        store.dispatch(navigateAction(decoded as TState))
      }
    }
  })

  return (next) => (action) => {
    const result = next(action)
    const currentHash = globalObject.location.hash.substr(1)
    const nextHash = encodeUrl(store.getState())

    if (currentHash !== nextHash) {
      setCurrentHash(nextHash)

      prevHash = nextHash
    }

    return result
  }
}

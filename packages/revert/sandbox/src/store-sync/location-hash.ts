import { globalObject, setCurrentHash, encodeUrl } from '../utils'
import { getHashState } from './get-hash-state'
import type { TSyncStore } from './types'

export const locationHash = (store: TSyncStore) => {
  globalObject.addEventListener('hashchange', () => {
    store.setState(
      getHashState()
    )
  })

  store.subscribe((state) => {
    setCurrentHash(encodeUrl(state))
  })
}

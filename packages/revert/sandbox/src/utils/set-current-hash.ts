import { globalObject } from './global-object'
import { onIdle } from './on-idle'

let unsubscribe: (() => void) | null = null

export const setCurrentHash = (hash: string) => {
  if (unsubscribe !== null) {
    unsubscribe()
    unsubscribe = null
  }

  unsubscribe = onIdle(() => {
    unsubscribe = null
    globalObject.history.replaceState(undefined, 'Sandbox', `#${hash}`)
  })
}

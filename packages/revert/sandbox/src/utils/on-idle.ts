import { isFunction } from 'tsfn'
import { globalObject } from './global-object'

export const onIdle = (cb: () => void) => {
  if (isFunction(globalObject.requestIdleCallback)) {
    const id = globalObject.requestIdleCallback(cb)

    return () => {
      if (isFunction(globalObject.cancelIdleCallback)) {
        globalObject.cancelIdleCallback(id)
      }
    }
  }

  const id = setTimeout(cb, 0)

  return () => {
    clearTimeout(id)
  }
}

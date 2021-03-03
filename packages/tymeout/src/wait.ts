import { ClearTimeoutFn, SetTimeoutFn } from './types'

export const waitFactory = (setTimeout: SetTimeoutFn, clearTimeout: ClearTimeoutFn) =>
  (timeGetter = () => 0) =>
    (cb: () => void) =>
      (ms = timeGetter()) => {
        const id = setTimeout(cb, ms)

        return () => {
          clearTimeout(id)
        }
      }

export const wait = waitFactory(setTimeout, clearTimeout)

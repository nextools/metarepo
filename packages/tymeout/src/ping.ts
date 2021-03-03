import { waitFactory } from './wait'
import { ClearTimeoutFn, SetTimeoutFn } from './types'

export const pingFactory = (setTimeout: SetTimeoutFn, clearTimeout: ClearTimeoutFn) => {
  const waitFn = waitFactory(setTimeout, clearTimeout)

  return (timeGetter: () => number) =>
    (cb: () => void) => {
      let unsub: () => void
      const wait = waitFn(timeGetter)(() => {
        cb()
        unsub = wait()
      })

      return () => {
        unsub = wait()

        return () => {
          unsub()
        }
      }
    }
}

export const ping = pingFactory(setTimeout, clearTimeout)

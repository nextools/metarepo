import { SetTimeoutFn } from './types'

export const waitPromiseFactory = (setTimeout: SetTimeoutFn) =>
  (timeGetter = () => 0) =>
    (ms = timeGetter()): Promise<void> =>
      new Promise((resolve) => setTimeout(() => resolve(), ms))

export const waitPromise = waitPromiseFactory(setTimeout)

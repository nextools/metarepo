import type { TCancelFn } from './types'

export const createCancelToken = () => {
  let cancelFn: TCancelFn
  const symbol = Symbol('CANCEL')

  return {
    token: {
      set onCancel(fn: () => void) {
        cancelFn = fn
      },
      get symbol() {
        return symbol
      },
    },
    cancel() {
      cancelFn()
    },
  }
}

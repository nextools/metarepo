export const throttle = (delayFn: (cb: (...args: any[]) => void) => any, cancelFn: (id: any) => void) =>
  (cb: (...args: any[]) => void) => {
    let id: any = null
    let fnArgs: any[]

    const delayCallback = () => {
      id = null

      cb(fnArgs)
    }

    return {
      fn: (...args: any[]) => {
        fnArgs = args

        if (id === null) {
          id = delayFn(delayCallback)
        }
      },
      cancel: () => {
        if (id !== null) {
          cancelFn(id)
        }
      },
    }
  }

export const throttleAnimationFrame = throttle((global as any as Window).requestAnimationFrame, (global as any as Window).cancelAnimationFrame)

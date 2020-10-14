import type { TObservable } from './types'

export const fromInterval = (ms: number): TObservable<number> => {
  return (next) => {
    let i = 0
    const timerId = setInterval(() => {
      next(i++)
    }, ms)

    return () => {
      clearInterval(timerId)
    }
  }
}

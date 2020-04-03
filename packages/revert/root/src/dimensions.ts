import { TDimensions } from './types'
import { throttleAnimationFrame } from './throttle'

export const getDimensions = (): TDimensions => ({
  width: window.innerWidth,
  height: window.innerHeight,
})

export const subscribeDimensions = (cb: (dimensions: TDimensions) => void) => {
  const { fn, cancel } = throttleAnimationFrame(() => cb(getDimensions()))

  window.addEventListener('resize', fn)

  return () => {
    cancel()
    window.removeEventListener('resize', fn)
  }
}

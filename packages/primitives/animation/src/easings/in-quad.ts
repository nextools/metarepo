import { TEasingFn } from '../types'

export const easeInQuad: TEasingFn = (from, to, time) => {
  return to * time * time + from
}

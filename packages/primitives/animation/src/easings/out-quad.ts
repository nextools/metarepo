import { TEasingFn } from '../types'

export const easeOutQuad: TEasingFn = (from, range, time) => {
  return -range * time * (time - 2) + from
}

import { TEasingFn } from '../types'

export const easeInCubic: TEasingFn = (from, to, time) => {
  return to * time * time * time + from
}

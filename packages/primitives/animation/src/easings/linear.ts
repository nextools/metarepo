import { TEasingFn } from '../types'

export const easeLinear: TEasingFn = (from, range, time) => {
  return time * range + from
}

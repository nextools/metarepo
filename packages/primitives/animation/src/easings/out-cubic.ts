/* eslint-disable no-param-reassign */
import { TEasingFn } from '../types'

export const easeOutCubic: TEasingFn = (from, range, time) => {
  return range * ((time -= 1) * time * time + 1) + from
}

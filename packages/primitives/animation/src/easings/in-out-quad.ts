/* eslint-disable no-param-reassign */
import { TEasingFn } from '../types'

export const easeInOutQuad: TEasingFn = (from, range, time) => {
  if ((time *= 2) < 1) {
    return range / 2 * time * time + from
  }

  return -range / 2 * ((--time) * (time - 2) - 1) + from
}

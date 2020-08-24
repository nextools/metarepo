/* eslint-disable no-param-reassign */
import type { TEasingFn } from './types'

export const easeInCubic: TEasingFn = (range, time) => {
  return range * time * time * time
}

export const easeInOutCubic: TEasingFn = (range, time) => {
  if ((time *= 2) < 1) {
    return range / 2 * time * time * time
  }

  return range / 2 * ((time -= 2) * time * time + 2)
}

export const easeInOutQuad: TEasingFn = (range, time) => {
  if ((time *= 2) < 1) {
    return range / 2 * time * time
  }

  return -range / 2 * ((--time) * (time - 2) - 1)
}

export const easeInQuad: TEasingFn = (to, time) => {
  return to * time * time
}

export const easeLinear: TEasingFn = (range, time) => {
  return time * range
}

export const easeOutCubic: TEasingFn = (range, time) => {
  return range * ((time -= 1) * time * time + 1)
}

export const easeOutQuad: TEasingFn = (range, time) => {
  return -range * time * (time - 2)
}

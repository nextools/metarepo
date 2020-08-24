import type { TEasingFn, TAnimationMapFn } from './types'

export const easeValue = (easingFn: TEasingFn): TAnimationMapFn<number> => (from, to, time) => {
  return easingFn(to - from, time) + from
}

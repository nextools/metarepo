import type { TEasingFn, TAnimationMapFn } from './types'

export const easeArray = (easingFn: TEasingFn): TAnimationMapFn<number[]> => (from, to, time) => {
  return to.map((toValue, i) => {
    const fromValue = from[i] ?? 0

    return easingFn(toValue - fromValue, time) + fromValue
  })
}

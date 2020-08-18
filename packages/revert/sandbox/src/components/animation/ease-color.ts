import { redChannel, greenChannel, blueChannel, alphaChannel, rgba } from '@revert/color'
import type { TColor } from '@revert/color'
import type { TAnimationMapFn, TEasingFn } from './types'

export const easeColor = (easingFn: TEasingFn): TAnimationMapFn<TColor> => (from, to, time) => {
  const redFrom = redChannel(from)
  const greenFrom = greenChannel(from)
  const blueFrom = blueChannel(from)
  const alphaFrom = alphaChannel(from)

  const redTo = redChannel(to)
  const greenTo = greenChannel(to)
  const blueTo = blueChannel(to)
  const alphaTo = alphaChannel(to)

  return rgba(
    easingFn(redTo - redFrom, time) + redFrom,
    easingFn(greenTo - greenFrom, time) + greenFrom,
    easingFn(blueTo - blueFrom, time) + blueFrom,
    easingFn(alphaTo - alphaFrom, time) + alphaFrom
  )
}

import { rgba, redChannel, greenChannel, blueChannel, alphaChannel } from '@revert/color'
import type { TColor } from '@revert/color'
import type { TAnimationMapFn, TEasingFn } from './types'

export const easeColor = (easingFn: TEasingFn): TAnimationMapFn<TColor> => (from, to, time) => {
  const redFrom = redChannel(from)
  const greenFrom = greenChannel(from)
  const blueFrom = blueChannel(from)
  const alphaFrom = alphaChannel(from)

  return rgba(
    easingFn(redChannel(to) - redFrom, time) + redFrom,
    easingFn(greenChannel(to) - greenFrom, time) + greenFrom,
    easingFn(blueChannel(to) - blueFrom, time) + blueFrom,
    easingFn(alphaChannel(to) - alphaFrom, time) + alphaFrom
  )
}

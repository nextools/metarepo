import { TRgb } from '@fantasy-color/types/src'
import normalizeRgb from '@fantasy-color/normalize-rgb'

const NORMALIZED_BELOW_10 = 0.03928

const toSrgb = (normalized: number) =>
  (normalized > NORMALIZED_BELOW_10
    ? Math.pow(((normalized + 0.055) / 1.055), 2.4)
    : normalized / 12.92)

export default (color: TRgb): TRgb => {
  const { red, green, blue } = normalizeRgb(color)

  return {
    red: toSrgb(red),
    green: toSrgb(green),
    blue: toSrgb(blue),
  }
}

import { TRgba } from '@fantasy-color/types'

export default ({ red, green, blue, alpha }: TRgba): TRgba => ({
  red: red / 255,
  green: green / 255,
  blue: blue / 255,
  alpha,
})

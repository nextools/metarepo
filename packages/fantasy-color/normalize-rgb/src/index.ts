import { TRgb } from '@fantasy-color/types'

export default ({ red, green, blue }: TRgb): TRgb => ({
  red: red / 255,
  green: green / 255,
  blue: blue / 255,
})

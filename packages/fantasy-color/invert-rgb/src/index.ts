import { TRgb } from '@fantasy-color/types/src'

export default ({ red, green, blue }: TRgb): TRgb => ({
  red: 255 - red,
  green: 255 - green,
  blue: 255 - blue,
})

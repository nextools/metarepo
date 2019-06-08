import { TRgb } from '@fantasy-color/types'

export default ({ red, green, blue }: TRgb): number =>
  0.2126 * red + 0.7152 * green + 0.0722 * blue

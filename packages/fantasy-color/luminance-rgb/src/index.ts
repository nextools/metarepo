import { TRgb } from '@fantasy-color/types'
import rgbToSrgb from '@fantasy-color/rgb-to-srgb'
import luminanceSrgb from '@fantasy-color/luminance-srgb'

export default (color: TRgb): number => luminanceSrgb(rgbToSrgb(color))

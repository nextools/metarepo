import { TRgb } from '@fantasy-color/types/src'
import luminanceRgb from '@fantasy-color/luminance-rgb'
import contrastRatioLuminance from '@fantasy-color/contrast-ratio-luminance'

export default (color1: TRgb, color2: TRgb): number =>
  contrastRatioLuminance(
    luminanceRgb(color1),
    luminanceRgb(color2)
  )

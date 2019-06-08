import { TRgb, THcl } from '@fantasy-color/types'
import rgbToLab from '@fantasy-color/rgb-to-lab'
import labToHcl from '@fantasy-color/lab-to-hcl'

export default (color: TRgb): THcl => labToHcl(rgbToLab(color))

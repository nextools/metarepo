import { TRgb, THcl } from '@fantasy-color/types'
import hclToLab from '@fantasy-color/hcl-to-lab'
import labToRgb from '@fantasy-color/lab-to-rgb'

// from https://github.com/d3/d3-color/blob/f666cf09dc21efcf570c0cb08e2bc4c864cc3c7c/src/lab.js
export default (color: THcl): TRgb =>
  labToRgb(hclToLab(color))

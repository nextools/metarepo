import { THcl, TLab } from '@fantasy-color/types'

// from https://github.com/d3/d3-color/blob/f666cf09dc21efcf570c0cb08e2bc4c864cc3c7c/src/lab.js
export default ({ luminance, a, b }: TLab): THcl => {
  const h = Math.atan2(b, a) * (180 / Math.PI)

  return {
    hue: h < 0 ? h + 360 : h,
    chroma: Math.sqrt(a * a + b * b),
    luminance,
  }
}

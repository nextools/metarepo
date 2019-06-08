import { THcl, TLab } from '@fantasy-color/types'

// from https://github.com/d3/d3-color/blob/f666cf09dc21efcf570c0cb08e2bc4c864cc3c7c/src/lab.js
export default ({ luminance, hue, chroma }: THcl): TLab => {
  const h = hue * (Math.PI / 180)

  return {
    luminance,
    a: Math.cos(h) * chroma,
    b: Math.sin(h) * chroma,
  }
}

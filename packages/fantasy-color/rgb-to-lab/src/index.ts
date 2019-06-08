import { TRgb, TLab } from '@fantasy-color/types'

// from https://github.com/d3/d3-color/blob/f666cf09dc21efcf570c0cb08e2bc4c864cc3c7c/src/lab.js
const t1 = 6 / 29
const t2 = 3 * t1 * t1
const t3 = t1 * t1 * t1

const rgb2lrgb = (x: number): number => {
  const x2 = x / 255

  return x2 <= 0.04045 ? x2 / 12.92 : Math.pow((x2 + 0.055) / 1.055, 2.4)
}

const xyz2lab = (t: number): number => (
  t > t3 ? Math.pow(t, 1 / 3) : t / t2 + 4 / 29
)

export default ({ red, green, blue }: TRgb): TLab => {
  const r = rgb2lrgb(red)
  const g = rgb2lrgb(green)
  const b = rgb2lrgb(blue)
  const y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / 1)

  const x = r === g && g === b ? y : xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / 0.96422)
  const z = r === g && g === b ? y : xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / 0.82521)

  return {
    luminance: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  }
}

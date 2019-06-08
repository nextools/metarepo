import { TRgb, TLab } from '@fantasy-color/types'

// from https://github.com/d3/d3-color/blob/f666cf09dc21efcf570c0cb08e2bc4c864cc3c7c/src/Tlab.js
const t1 = 6 / 29
const t2 = 3 * t1 * t1

const lrgb2rgb = (x: number): number =>
  Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055))

const lab2xyz = (t: number): number => (
  t > t1 ? t * t * t : t2 * (t - 4 / 29)
)

export default ({ luminance, a, b }: TLab): TRgb => {
  const baseY = (luminance + 16) / 116
  const x = 0.96422 * lab2xyz(baseY + a / 500)
  const y = Number(lab2xyz(baseY))
  const z = 0.82521 * lab2xyz(baseY - b / 200)

  return {
    red: lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
    green: lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
    blue: lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
  }
}

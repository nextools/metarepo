import { TRgba, THsva } from '@fantasy-color/types'
import normalizeRgba from '@fantasy-color/normalize-rgba'

export default (color: TRgba): THsva => {
  const { red, green, blue, alpha } = normalizeRgba(color)

  const min = Math.min(Math.min(red, green), blue)
  const max = Math.max(Math.max(red, green), blue)
  const delta = max - min

  const value = Math.round(max * 100)

  // If grey shade
  if (delta === 0) {
    return {
      hue: 0,
      saturation: 0,
      value,
      alpha,
    }
  }

  // Hue
  let hue

  if (max === red) {
    hue = (60 * ((green - blue) / (max - min))) % 360
  } else if (max === green) {
    hue = 60 * ((blue - red) / (max - min)) + 120
  } else {
    hue = 60 * ((red - green) / (max - min)) + 240
  }

  if (hue < 0) {
    hue += 360
  }

  // Saturation
  const saturation = 1 - (min / max)

  return {
    hue: Math.round(hue),
    saturation: Math.round(saturation * 100),
    value,
    alpha,
  }
}

import { TRgba } from '@fantasy-color/types'

const rgbaRegex = /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d+)\s*\)\s*$/

export default (rgba: string): TRgba | null => {
  const matches = rgba.match(rgbaRegex)
  if (matches === null) {
    return null
  }

  return {
    red: parseInt(matches[1]),
    green: parseInt(matches[2]),
    blue: parseInt(matches[3]),
    alpha: parseFloat(matches[4]),
  }
}

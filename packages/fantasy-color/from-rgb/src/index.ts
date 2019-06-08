import { TRgb } from '@fantasy-color/types'

const rgbRegex = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/

export default (rgb: string): TRgb | null => {
  const matches = rgb.match(rgbRegex)
  if (matches === null) {
    return null
  }

  return {
    red: parseInt(matches[1]),
    green: parseInt(matches[2]),
    blue: parseInt(matches[3]),
  }
}

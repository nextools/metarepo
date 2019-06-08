import { TRgb } from '@fantasy-color/types'

export default (hex: string): TRgb | null => {
  if (hex[0] !== '#' || hex.length !== 7) {
    return null
  }

  return {
    red: parseInt(hex.slice(1, 3), 16),
    green: parseInt(hex.slice(3, 5), 16),
    blue: parseInt(hex.slice(5, 7), 16),
  }
}

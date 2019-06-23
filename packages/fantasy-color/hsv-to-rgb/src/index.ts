import { TRgb, THsv } from '@fantasy-color/types'

export default ({ hue, saturation, value }: THsv): TRgb => {
  const normalizedSaturation = saturation / 100
  const normalizedValue = value / 100

  const hueSextile = Math.floor((hue / 60) % 6)
  const f = (hue / 60) - hueSextile
  const p = normalizedValue * (1 - normalizedSaturation)
  const q = normalizedValue * (1 - f * normalizedSaturation)
  const t = normalizedValue * (1 - (1 - f) * normalizedSaturation)

  let blue
  let green
  let red

  switch (hueSextile) {
    case 0:
      red = normalizedValue
      green = t
      blue = p

      break
    case 1:
      red = q
      green = normalizedValue
      blue = p

      break
    case 2:
      red = p
      green = normalizedValue
      blue = t

      break
    case 3:
      red = p
      green = q
      blue = normalizedValue

      break
    case 4:
      red = t
      green = p
      blue = normalizedValue

      break
    default:
      red = normalizedValue
      green = p
      blue = q

      break
  }

  return {
    red: Math.min(255, Math.round(red * 256)),
    green: Math.min(255, Math.round(green * 256)),
    blue: Math.min(255, Math.round(blue * 256)),
  }
}

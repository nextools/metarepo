import { THsv, THsva } from '@fantasy-color/types'

export default ({ hue, saturation, value }: THsv): THsva => ({
  hue,
  saturation,
  value,
  alpha: 1,
})

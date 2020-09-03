import { redChannel, greenChannel, blueChannel, rgba } from '@revert/color'
import type { TColor } from '@revert/color'
import type { TGraphEntry } from '../types'

export const getLastDifference = ({ values }: TGraphEntry): number => {
  let lastDifference = 100

  if (values.length > 1) {
    const lastValue = values[values.length - 1].value
    const preLastValue = values[values.length - 2].value

    lastDifference = Math.round((lastValue - preLastValue) / preLastValue * 100.0)
  }

  return lastDifference
}

export const printGraphValue = (value: number) => `(${value > 0 ? '+' : ''}${String(value)}%)`

export const changeColorAlpha = (color: TColor, alpha: number): TColor => {
  return rgba(
    redChannel(color),
    greenChannel(color),
    blueChannel(color),
    alpha
  )
}


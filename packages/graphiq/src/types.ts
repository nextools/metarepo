import type { TColor } from '@revert/color'

export type TEntry = {
  version: string,
  value: number,
  timestamp: number,
}

export type TGraphColors = [TColor, TColor]

export type TGraphEntry = {
  graphName: string,
  colors: TGraphColors,
  values: TEntry[],
}

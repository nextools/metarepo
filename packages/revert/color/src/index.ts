import {
  TColor as TColoridoColor,
  isColor as coloridoIsColor,
  colorToString as coloridoColorToString,
} from 'colorido'

export type TColor = Readonly<TColoridoColor>
export const colorToString = coloridoColorToString as (color: TColor) => string
export const isColor = coloridoIsColor as (color: any) => color is TColor
export const setColorAlpha = (color: TColor, alpha: number): TColor => [color[0], color[1], color[2], alpha]

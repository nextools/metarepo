import {
  TColor as TColoridoColor,
  isColor as coloridoIsColor,
  colorToString as coloridoColorToString,
} from 'colorido'

export type TColor = Readonly<TColoridoColor>
export const colorToString = coloridoColorToString as (color: TColor) => string
export const isColor = coloridoIsColor as (color: any) => color is TColor

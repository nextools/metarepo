import {
  TColor as TColoridoColor,
  isColor as coloridoIsColor,
  colorToString as coloridoColorToString,
} from 'colorido'

export type TColor = Readonly<TColoridoColor>
export const colorToString = coloridoColorToString as (color: TColor) => string
export const isColor = coloridoIsColor as (color: any) => color is TColor

export const BLACK: TColor = [0x0, 0x0, 0x0, 1]
export const WHITE: TColor = [0xFF, 0xFF, 0xFF, 1]
export const TRANSPARENT: TColor = [0, 0, 0, 0]

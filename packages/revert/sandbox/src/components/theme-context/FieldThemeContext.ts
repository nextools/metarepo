import type { TColor } from '@revert/color'
import type { TFontWeight } from '@revert/text'
import { createContext } from 'react'
import { COLOR_BLACK } from '../../colors'

export type TFieldThemeContext = {
  color: TColor,
  fontFamily: string,
  fontSize: number,
  fontWeight: TFontWeight,
  lineHeight: number,
  placeholderColor: TColor,
  leftPadding: number,
  rightPadding: number,
}

export const FieldThemeContext = createContext<TFieldThemeContext>({
  color: COLOR_BLACK,
  placeholderColor: COLOR_BLACK,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  leftPadding: 0,
  rightPadding: 0,
})

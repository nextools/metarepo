import type { TColor } from '@revert/color'
import type { TFontWeight } from '@revert/text'
import { createContext } from 'react'
import { COLOR_BLACK } from '../../colors'

export type TDropdownThemeContext = {
  hoveredColor: TColor,
  focusedBorderColor: TColor,
  color: TColor,
  fontFamily: string,
  fontSize: number,
  fontWeight: TFontWeight,
  lineHeight: number,
}

export const DropdownThemeContext = createContext<TDropdownThemeContext>({
  color: COLOR_BLACK,
  hoveredColor: COLOR_BLACK,
  focusedBorderColor: COLOR_BLACK,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
})

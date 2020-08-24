import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { BLACK } from '../../colors'
import type { TTextThemeContext } from './TextThemeContext'

export type TDropdownThemeContext = TTextThemeContext & {
  hoveredColor: TColor,
  focusedBorderColor: TColor,
}

export const DropdownThemeContext = createContext<TDropdownThemeContext>({
  color: BLACK,
  hoveredColor: BLACK,
  focusedBorderColor: BLACK,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
})

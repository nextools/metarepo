import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { COLOR_WHITE, COLOR_BLACK } from '../../colors'

export type TTooltipThemeContext = {
  backgroundColor: TColor,
  color: TColor,
}

export const TooltipThemeContext = createContext<TTooltipThemeContext>({
  backgroundColor: COLOR_WHITE,
  color: COLOR_BLACK,
})

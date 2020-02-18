import { createContext } from 'react'
import { TColor, WHITE, BLACK } from '../../colors'

export type TTooltipThemeContext = {
  backgroundColor: TColor,
  color: TColor,
}

export const TooltipThemeContext = createContext<TTooltipThemeContext>({
  backgroundColor: WHITE,
  color: BLACK,
})

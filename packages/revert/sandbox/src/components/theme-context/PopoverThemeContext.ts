import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { COLOR_WHITE } from '../../colors'

export type TPopoverThemeContext = {
  backgroundColor: TColor,
}

export const PopoverThemeContext = createContext<TPopoverThemeContext>({
  backgroundColor: COLOR_WHITE,
})

import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { WHITE } from '../../colors'

export type TPopoverThemeContext = {
  backgroundColor: TColor,
}

export const PopoverThemeContext = createContext<TPopoverThemeContext>({
  backgroundColor: WHITE,
})

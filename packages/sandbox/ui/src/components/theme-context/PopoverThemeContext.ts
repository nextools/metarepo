import { createContext } from 'react'
import { TColor, WHITE } from '../../colors'

export type TPopoverThemeContext = {
  backgroundColor: TColor,
}

export const PopoverThemeContext = createContext<TPopoverThemeContext>({
  backgroundColor: WHITE,
})

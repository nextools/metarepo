import { createContext } from 'react'
import { TColor, BLACK, WHITE } from '../../colors'

export type TButtonIconThemeContext = {
  backgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  focusedBorderColor: TColor,
  iconColor: TColor,
  hoveredIconColor: TColor,
  pressedIconColor: TColor,
}

export const ButtonIconThemeContext = createContext<TButtonIconThemeContext>({
  backgroundColor: WHITE,
  hoveredBackgroundColor: WHITE,
  pressedBackgroundColor: WHITE,
  focusedBorderColor: WHITE,
  iconColor: BLACK,
  hoveredIconColor: BLACK,
  pressedIconColor: BLACK,
})

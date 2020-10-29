import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { COLOR_BLACK, COLOR_WHITE } from '../../colors'

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
  backgroundColor: COLOR_WHITE,
  hoveredBackgroundColor: COLOR_WHITE,
  pressedBackgroundColor: COLOR_WHITE,
  focusedBorderColor: COLOR_WHITE,
  iconColor: COLOR_BLACK,
  hoveredIconColor: COLOR_BLACK,
  pressedIconColor: COLOR_BLACK,
})

ButtonIconThemeContext.displayName = 'ButtonIconThemeContext'

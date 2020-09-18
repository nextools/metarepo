import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { COLOR_WHITE, COLOR_BLACK } from '../../colors'

export type TButtonIconSwitchThemeContext = {
  backgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  activeBackgroundColor: TColor,
  activeHoveredBackgroundColor: TColor,
  activePressedBackgroundColor: TColor,
  focusedBorderColor: TColor,
  activeFocusedBorderColor: TColor,
  iconColor: TColor,
  hoveredIconColor: TColor,
  pressedIconColor: TColor,
  activeIconColor: TColor,
  activeHoveredIconColor: TColor,
  activePressedIconColor: TColor,
}

export const ButtonIconSwitchThemeContext = createContext<TButtonIconSwitchThemeContext>({
  backgroundColor: COLOR_WHITE,
  hoveredBackgroundColor: COLOR_WHITE,
  pressedBackgroundColor: COLOR_WHITE,
  activeBackgroundColor: COLOR_WHITE,
  activeHoveredBackgroundColor: COLOR_WHITE,
  activePressedBackgroundColor: COLOR_WHITE,
  focusedBorderColor: COLOR_WHITE,
  activeFocusedBorderColor: COLOR_WHITE,
  iconColor: COLOR_BLACK,
  hoveredIconColor: COLOR_BLACK,
  pressedIconColor: COLOR_BLACK,
  activeIconColor: COLOR_BLACK,
  activeHoveredIconColor: COLOR_BLACK,
  activePressedIconColor: COLOR_BLACK,
})

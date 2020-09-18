import type { TColor } from '@revert/color'
import { createContext } from 'react'
import { COLOR_WHITE, COLOR_BLACK } from '../../colors'

export type TSwitchThemeContext = {
  backgroundColor: TColor,
  activeBackgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  activeHoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  activePressedBackgroundColor: TColor,
  focusedOuterBorderColor: TColor,
  activeFocusedOuterBorderColor: TColor,
  iconColor: TColor,
  activeIconColor: TColor,
  hoveredIconColor: TColor,
  activeHoveredIconColor: TColor,
  pressedIconColor: TColor,
  activePressedIconColor: TColor,
}

export const SwitchThemeContext = createContext<TSwitchThemeContext>({
  backgroundColor: COLOR_WHITE,
  activeBackgroundColor: COLOR_WHITE,
  hoveredBackgroundColor: COLOR_WHITE,
  activeHoveredBackgroundColor: COLOR_WHITE,
  pressedBackgroundColor: COLOR_WHITE,
  activePressedBackgroundColor: COLOR_WHITE,
  focusedOuterBorderColor: COLOR_WHITE,
  activeFocusedOuterBorderColor: COLOR_WHITE,
  iconColor: COLOR_BLACK,
  activeIconColor: COLOR_BLACK,
  hoveredIconColor: COLOR_BLACK,
  activeHoveredIconColor: COLOR_BLACK,
  pressedIconColor: COLOR_BLACK,
  activePressedIconColor: COLOR_BLACK,
})

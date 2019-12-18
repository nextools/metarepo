import { createContext } from 'react'
import { TColor, WHITE, BLACK } from '../../colors'

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
  backgroundColor: WHITE,
  activeBackgroundColor: WHITE,
  hoveredBackgroundColor: WHITE,
  activeHoveredBackgroundColor: WHITE,
  pressedBackgroundColor: WHITE,
  activePressedBackgroundColor: WHITE,
  focusedOuterBorderColor: WHITE,
  activeFocusedOuterBorderColor: WHITE,
  iconColor: BLACK,
  activeIconColor: BLACK,
  hoveredIconColor: BLACK,
  activeHoveredIconColor: BLACK,
  pressedIconColor: BLACK,
  activePressedIconColor: BLACK,
})

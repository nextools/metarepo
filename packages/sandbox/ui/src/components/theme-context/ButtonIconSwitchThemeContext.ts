import { createContext } from 'react'
import { TColor, WHITE, BLACK } from '../../colors'

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
  backgroundColor: WHITE,
  hoveredBackgroundColor: WHITE,
  pressedBackgroundColor: WHITE,
  activeBackgroundColor: WHITE,
  activeHoveredBackgroundColor: WHITE,
  activePressedBackgroundColor: WHITE,
  focusedBorderColor: WHITE,
  activeFocusedBorderColor: WHITE,
  iconColor: BLACK,
  hoveredIconColor: BLACK,
  pressedIconColor: BLACK,
  activeIconColor: BLACK,
  activeHoveredIconColor: BLACK,
  activePressedIconColor: BLACK,
})

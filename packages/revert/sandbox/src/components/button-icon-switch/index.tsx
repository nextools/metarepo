import { Block } from '@revert/block'
import { Checkbox } from '@revert/checkbox'
import { Layout, Layout_Item } from '@revert/layout'
import { Size } from '@revert/size'
import { TextThemeContext } from '@revert/text'
import type { ReactNode } from 'react'
import {
  mapDefaultProps,
  startWithType,
  mapWithProps,
  mapHovered,
  mapKeyboardFocused,
  component,
  mapContext,
  mapPressed,
} from 'refun'
import type { TMapHovered, TMapKeyboardFocused } from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapChildren } from '../../map/children'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_ICON, SYMBOL_TOOLTIP, SYMBOL_BUTTON_ICON } from '../../symbols'
import { Background } from '../background'
import { Border } from '../border'
import { ButtonIconSwitchThemeContext } from '../theme-context'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4

export type TButtonIconSwitch = {
  size?: number,
  accessibilityLabel?: string,
  isChecked: boolean,
  children: ReactNode,
  onToggle: () => void,
} & TMapHovered
  & TMapKeyboardFocused

export const ButtonIconSwitch = component(
  startWithType<TButtonIconSwitch>(),
  mapContext(ButtonIconSwitchThemeContext),
  mapDefaultProps({
    accessibilityLabel: '',
    size: 26,
  }),
  mapChildren({
    icon: {
      symbols: [SYMBOL_ICON],
      isRequired: true,
    },
    tooltip: {
      symbols: [SYMBOL_TOOLTIP],
    },
  }),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    size,
    isChecked,
    isKeyboardFocused,
    isPressed,
    isHovered,
    focusedBorderColor,
    activeFocusedBorderColor,
    iconColor,
    activeHoveredIconColor,
    activeIconColor,
    activePressedIconColor,
    hoveredIconColor,
    pressedIconColor,
    backgroundColor,
    activeBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
  }) => ({
    backgroundColor: (
      isChecked && isPressed ? activePressedBackgroundColor :
      isPressed ? pressedBackgroundColor :
      isChecked && isHovered ? activeHoveredBackgroundColor :
      isHovered ? hoveredBackgroundColor :
      isChecked ? activeBackgroundColor :
      backgroundColor
    ),
    borderColor: (
      isChecked && isKeyboardFocused ? activeFocusedBorderColor :
      isKeyboardFocused ? focusedBorderColor :
      COLOR_TRANSPARENT
    ),
    color: (
      isPressed && isChecked ? activePressedIconColor :
      isPressed ? pressedIconColor :
      isHovered && isChecked ? activeHoveredIconColor :
      isHovered ? hoveredIconColor :
      isChecked ? activeIconColor :
      iconColor
    ),
    radius: size / 2,
    borderRadius: (size / 2) + BORDER_OVERFLOW,
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  size,
  radius,
  borderRadius,
  accessibilityLabel,
  backgroundColor,
  borderColor,
  IconThemeProvider,
  icon,
  tooltip,
  isChecked,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onToggle,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <Block width={size} height={size}>
    <Background
      color={backgroundColor}
      radius={radius}
    />
    <Border
      color={borderColor}
      radius={borderRadius}
      borderWidth={BORDER_WIDTH}
      overflow={BORDER_OVERFLOW}
    />
    {isHovered && tooltip}
    <Checkbox
      isChecked={isChecked}
      accessibilityLabel={accessibilityLabel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onToggle={onToggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Layout>
        <Layout_Item hAlign="center" vAlign="center">
          <Size>
            <IconThemeProvider>
              {icon}
            </IconThemeProvider>
          </Size>
        </Layout_Item>
      </Layout>
    </Checkbox>
  </Block>
))

ButtonIconSwitch.displayName = 'ButtonIconSwitch'
ButtonIconSwitch.componentSymbol = SYMBOL_BUTTON_ICON

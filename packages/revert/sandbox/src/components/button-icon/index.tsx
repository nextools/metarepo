import { Block } from '@revert/block'
import { PrimitiveButton } from '@revert/button'
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
  mapPressed,
  component,
  mapContext,
} from 'refun'
import type {
  TMapPressed,
  TMapKeyboardFocused,
  TMapHovered,
} from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapChildren } from '../../map/children'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_ICON, SYMBOL_TOOLTIP, SYMBOL_BUTTON_ICON } from '../../symbols'
import { PrimitiveBackground } from '../background'
import { PrimitiveBorder } from '../border'
import { ButtonIconThemeContext } from '../theme-context'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4

export type TButtonIcon = {
  size?: number,
  accessibilityLabel?: string,
  children: ReactNode,
  onPress: () => void,
} & TMapPressed
  & TMapHovered
  & TMapKeyboardFocused

export const ButtonIcon = component(
  startWithType<TButtonIcon>(),
  mapContext(ButtonIconThemeContext),
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
  mapPressed,
  mapHovered,
  mapKeyboardFocused,
  mapWithProps(({
    isHovered,
    isPressed,
    isKeyboardFocused,
    backgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    focusedBorderColor,
    iconColor,
    hoveredIconColor,
    pressedIconColor,
    size,
  }) => ({
    backgroundColor: (
      isPressed ? pressedBackgroundColor :
      isHovered ? hoveredBackgroundColor :
      backgroundColor
    ),
    borderColor: (
      isKeyboardFocused ? focusedBorderColor :
      COLOR_TRANSPARENT
    ),
    color: (
      isPressed ? pressedIconColor :
      isHovered ? hoveredIconColor :
      iconColor
    ),
    radius: size / 2,
    borderRadius: (size / 2) + BORDER_OVERFLOW,
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  size,
  borderRadius,
  radius,
  accessibilityLabel,
  backgroundColor,
  borderColor,
  tooltip,
  icon,
  IconThemeProvider,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <Block width={size} height={size}>
    <PrimitiveBackground
      radius={radius}
      color={backgroundColor}
    />
    <PrimitiveBorder
      color={borderColor}
      radius={borderRadius}
      borderWidth={BORDER_WIDTH}
      overflow={BORDER_OVERFLOW}
    />
    {isHovered && tooltip}
    <PrimitiveButton
      accessibilityLabel={accessibilityLabel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPress={onPress}
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
    </PrimitiveButton>
  </Block>
))

ButtonIcon.displayName = 'ButtonIcon'
ButtonIcon.componentSymbol = SYMBOL_BUTTON_ICON

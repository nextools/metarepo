import { Block, InlineBlock } from '@revert/block'
import { PrimitiveButton } from '@revert/button'
import { Layout, Layout_Item } from '@revert/layout'
import { TextThemeContext } from '@revert/text'
import { elegir } from 'elegir'
import React from 'react'
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
    backgroundColor: elegir(
      isPressed,
      pressedBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      true,
      backgroundColor
    ),
    borderColor: elegir(
      isKeyboardFocused,
      focusedBorderColor,
      true,
      COLOR_TRANSPARENT
    ),
    color: elegir(
      isPressed,
      pressedIconColor,
      isHovered,
      hoveredIconColor,
      true,
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
          <InlineBlock>
            <IconThemeProvider>
              {icon}
            </IconThemeProvider>
          </InlineBlock>
        </Layout_Item>
      </Layout>
    </PrimitiveButton>
  </Block>
))

ButtonIcon.displayName = 'ButtonIcon'
ButtonIcon.componentSymbol = SYMBOL_BUTTON_ICON

import React, { ReactNode } from 'react'
import { elegir } from 'elegir'
import {
  mapDefaultProps,
  startWithType,
  mapWithProps,
  mapHovered,
  TMapHovered,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  mapPressed,
  TMapPressed,
  component,
  mapContext,
} from 'refun'
import { PrimitiveButton } from '../primitive-button'
import { PrimitiveBackground } from '../primitive-background'
import { PrimitiveBorder } from '../primitive-border'
import { SYMBOL_ICON, SYMBOL_TOOLTIP, SYMBOL_BUTTON_ICON } from '../../symbols'
import { mapChildren } from '../../map/children'
import { SizeBlock } from '../size-block'
import { TextThemeContext, ButtonIconThemeContext } from '../theme-context'
import { Layout, Layout_Item } from '../layout'
import { TRANSPARENT } from '../../colors'
import { SizeContent } from '../size-content'
import { mapContextOverride } from '../../map/map-context-override'

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
      TRANSPARENT
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
  <SizeBlock width={size} height={size}>
    <PrimitiveBackground
      radius={radius}
      color={backgroundColor}
    />
    <PrimitiveBorder
      color={borderColor}
      radius={borderRadius}
      width={BORDER_WIDTH}
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
          <SizeContent>
            <IconThemeProvider>
              {icon}
            </IconThemeProvider>
          </SizeContent>
        </Layout_Item>
      </Layout>
    </PrimitiveButton>
  </SizeBlock>
))

ButtonIcon.displayName = 'ButtonIcon'
ButtonIcon.componentSymbol = SYMBOL_BUTTON_ICON

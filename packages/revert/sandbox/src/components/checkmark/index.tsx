import { Background } from '@revert/background'
import { PrimitiveBlock, Block } from '@revert/block'
import { Border } from '@revert/border'
import { Checkbox } from '@revert/checkbox'
import { elegir } from 'elegir'
import React from 'react'
import {
  mapWithProps,
  startWithType,
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  pureComponent,
  mapDefaultProps,
  mapContext,
} from 'refun'
import type {
  TMapHovered,
  TMapPressed,
  TMapKeyboardFocused,
} from 'refun'
import { TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_CHECKMARK } from '../../symbols'
import { IconCheckmarkSmall } from '../icons'
import { CheckmarkThemeContext, TextThemeContext } from '../theme-context'

const WIDTH = 20
const HEIGHT = 20
const RADIUS = 5
const BORDER_WIDTH = 1
const ICON_OFFSET = 4
const KEYBOARD_BORDER_OFFSET = 4
const KEYBOARD_BORDER_WIDTH = 2
const KEYBOARD_BORDER_RADIUS = RADIUS + KEYBOARD_BORDER_OFFSET

export type TCheckmark = {
  isDisabled?: boolean,
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Checkmark = pureComponent(
  startWithType<TCheckmark>(),
  mapDefaultProps({
    isDisabled: false,
  }),
  mapContext(CheckmarkThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    isDisabled,
    isHovered,
    isPressed,
    isKeyboardFocused,
    isChecked,
    backgroundColor,
    activeBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    disabledBackgroundColor,
    activeDisabledBackgroundColor,
    borderColor,
    activeBorderColor,
    hoveredBorderColor,
    pressedBorderColor,
    activeHoveredBorderColor,
    activePressedBorderColor,
    disabledBorderColor,
    activeDisabledBorderColor,
    focusedOuterBorderColor,
    activeFocusedOuterBorderColor,
    iconColor,
    hoveredIconColor,
    pressedIconColor,
    disabledIconColor,
  }) => ({
    color: elegir(
      !isChecked,
      TRANSPARENT,
      isDisabled,
      disabledIconColor,
      isPressed,
      pressedIconColor,
      isHovered,
      hoveredIconColor,
      true,
      iconColor
    ),
    backgroundColor: elegir(
      isChecked && isDisabled,
      activeDisabledBackgroundColor,
      isDisabled,
      disabledBackgroundColor,
      isChecked && isPressed,
      activePressedBackgroundColor,
      isPressed,
      pressedBackgroundColor,
      isChecked && isHovered,
      activeHoveredBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      isChecked,
      activeBackgroundColor,
      true,
      backgroundColor
    ),
    borderColor: elegir(
      isChecked && isDisabled,
      activeDisabledBorderColor,
      isDisabled,
      disabledBorderColor,
      isChecked && isPressed,
      activePressedBorderColor,
      isPressed,
      pressedBorderColor,
      isChecked && isHovered,
      activeHoveredBorderColor,
      isHovered,
      hoveredBorderColor,
      isChecked,
      activeBorderColor,
      true,
      borderColor
    ),
    keyboardBorderColor: elegir(
      isChecked && isKeyboardFocused,
      activeFocusedOuterBorderColor,
      isKeyboardFocused,
      focusedOuterBorderColor,
      true,
      TRANSPARENT
    ),
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  isDisabled,
  isChecked,
  borderColor,
  backgroundColor,
  keyboardBorderColor,
  IconThemeProvider,
  onToggle,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Block width={WIDTH} height={HEIGHT}>
    <Checkbox
      isDisabled={isDisabled}
      isChecked={isChecked}
      onToggle={onToggle}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Background
        color={backgroundColor}
        radius={RADIUS}
      />
      <Border
        color={borderColor}
        borderWidth={BORDER_WIDTH}
        radius={RADIUS}
      />
      <Border
        color={keyboardBorderColor}
        borderWidth={KEYBOARD_BORDER_WIDTH}
        radius={KEYBOARD_BORDER_RADIUS}
        overflow={KEYBOARD_BORDER_OFFSET}
      />
      <PrimitiveBlock left={ICON_OFFSET} top={ICON_OFFSET}>
        <IconThemeProvider>
          <IconCheckmarkSmall/>
        </IconThemeProvider>
      </PrimitiveBlock>
    </Checkbox>
  </Block>
))

Checkmark.displayName = 'Checkmark'
Checkmark.componentSymbol = SYMBOL_CHECKMARK

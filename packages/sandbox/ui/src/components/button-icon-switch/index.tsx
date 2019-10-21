import React, { cloneElement, Children, ReactElement } from 'react'
import { elegir } from 'elegir'
import {
  mapDefaultProps,
  startWithType,
  mapWithProps,
  mapHovered,
  TMapHovered,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  component,
} from 'refun'
import { Checkbox } from '@primitives/checkbox'
import { Background } from '../background'
import { Border } from '../border'
import { Block } from '../block'
import { TPosition } from '../../types'
import { mapTheme } from '../themes'

const ICON_SIZE = 20
const SIZE = 30
const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const BORDER_SIZE = SIZE + BORDER_WIDTH * 2 + BORDER_OVERFLOW * 2
const RADIUS = SIZE / 2
const BORDER_RADIUS = BORDER_SIZE / 2
const ICON_OFFSET = (SIZE - ICON_SIZE) / 2

export const buttonIconSwitchSize = SIZE
export const buttonIconSwitchSizeOverflow = SIZE + BORDER_OVERFLOW

export type TButtonIconSwitch = {
  accessibilityLabel?: string,
  children: ReactElement<any>,
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapKeyboardFocused
  & TPosition

export const ButtonIconSwitch = component(
  startWithType<TButtonIconSwitch>(),
  mapTheme(),
  mapDefaultProps({
    accessibilityLabel: '',
  }),
  mapHovered,
  mapKeyboardFocused,
  mapWithProps(({ theme, isChecked, isHovered, isKeyboardFocused }) => ({
    backgroundColor: elegir(
      isChecked && isHovered,
      theme.foregroundActiveHover,
      isChecked,
      theme.foregroundActive,
      isHovered,
      theme.foregroundHover,
      true,
      theme.foreground
    ),
    borderColor: elegir(
      isKeyboardFocused && isChecked,
      theme.outlineActiveFocus,
      isKeyboardFocused,
      theme.outlineIdleFocus,
      true,
      theme.foregroundTransparent
    ),
    iconColor: elegir(
      isChecked,
      theme.textInverted,
      true,
      theme.text
    ),
  }))
)(({
  left,
  top,
  accessibilityLabel,
  backgroundColor,
  borderColor,
  iconColor,
  children,
  isChecked,
  onPointerEnter,
  onPointerLeave,
  onToggle,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <Block left={left} top={top} width={SIZE} height={SIZE}>
    <Background
      topLeftRadius={RADIUS}
      topRightRadius={RADIUS}
      bottomLeftRadius={RADIUS}
      bottomRightRadius={RADIUS}
      color={backgroundColor}
    />
    <Border
      color={borderColor}
      topLeftRadius={BORDER_RADIUS}
      topRightRadius={BORDER_RADIUS}
      bottomLeftRadius={BORDER_RADIUS}
      bottomRightRadius={BORDER_RADIUS}
      topWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      overflow={BORDER_OVERFLOW}
    />
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
      <Block left={ICON_OFFSET} top={ICON_OFFSET}>
        {cloneElement(Children.only(children), { color: iconColor })}
      </Block>
    </Checkbox>
  </Block>
))

ButtonIconSwitch.displayName = 'ButtonIconSwitch'

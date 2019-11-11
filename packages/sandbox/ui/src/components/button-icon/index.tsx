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
  mapPressed,
  TMapPressed,
  component,
} from 'refun'
import { Button } from '@primitives/button'
import { Background } from '../background'
import { Border } from '../border'
import { TPosition } from '../../types'
import { Block } from '../block'
import { mapTheme } from '../themes'

const SIZE = 30
const ICON_SIZE = 20
const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const BORDER_SIZE = SIZE + BORDER_WIDTH * 2 + BORDER_OVERFLOW * 2
const RADIUS = SIZE / 2
const BORDER_RADIUS = BORDER_SIZE / 2
const ICON_OFFSET = (SIZE - ICON_SIZE) / 2

export const buttonIconSize = SIZE
export const buttonIconSizeOverflow = buttonIconSize + BORDER_OVERFLOW

export type TButtonIcon = {
  accessibilityLabel?: string,
  isInverted?: boolean,
  children: ReactElement<any>,
  onPress: () => void,
} & TMapPressed
  & TMapHovered
  & TMapKeyboardFocused
  & TPosition

export const ButtonIcon = component(
  startWithType<TButtonIcon>(),
  mapTheme(),
  mapDefaultProps({
    accessibilityLabel: '',
    isInverted: false,
  }),
  mapPressed,
  mapHovered,
  mapKeyboardFocused,
  mapWithProps(({ theme, isHovered, isPressed, isKeyboardFocused, isInverted }) => ({
    backgroundColor: elegir(
      isInverted,
      elegir(
        isPressed,
        theme.foregroundActivePressed,
        isHovered,
        theme.foregroundActiveHover,
        true,
        theme.foregroundActive
      ),
      true,
      elegir(
        isPressed,
        theme.foregroundActive,
        isHovered,
        theme.foregroundHover,
        true,
        theme.foreground
      )
    ),
    borderColor: elegir(
      isInverted,
      elegir(
        isKeyboardFocused,
        theme.outlineActiveFocus,
        true,
        theme.foregroundTransparent
      ),
      true,
      elegir(
        isKeyboardFocused,
        theme.outlineIdleFocus,
        true,
        theme.foregroundTransparent
      )
    ),
    iconColor: elegir(
      isInverted,
      theme.textInverted,
      true,
      elegir(
        isPressed,
        theme.textInverted,
        true,
        theme.text
      )
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
  onPointerEnter,
  onPointerLeave,
  onPress,
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
    <Button
      accessibilityLabel={accessibilityLabel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Block left={ICON_OFFSET} top={ICON_OFFSET}>
        {cloneElement(Children.only(children), { color: iconColor })}
      </Block>
    </Button>
  </Block>
))

ButtonIcon.displayName = 'ButtonIcon'

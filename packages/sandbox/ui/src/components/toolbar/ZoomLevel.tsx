import React from 'react'
import { component, startWithType, TMapHovered, TMapKeyboardFocused, mapHovered, mapContext, mapKeyboardFocused, mapPressed, mapWithProps } from 'refun'
import { elegir } from 'elegir'
import { SizeBlock } from '../size-block'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { IconResetTransform } from '../icons'
import { Tooltip } from '../tooltip'
import { SizeContent } from '../size-content'
import { SizeButton } from '../size-button'
import { SizeBorder } from '../size-border'
import { ButtonIconThemeContext, TextThemeContext } from '../theme-context'
import { TRANSPARENT } from '../../colors'
import { SizeBackground } from '../size-background'
import { mapContextOverride } from '../../map/map-context-override'

const WIDTH = 75
const HEIGHT = 30
const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const RADIUS = HEIGHT / 2
const BORDER_RADIUS = RADIUS + BORDER_OVERFLOW

export type TZoomLevel = {
  onPress: () => void,
  children: string,
} & TMapHovered
  & TMapKeyboardFocused

export const ZoomLevel = component(
  startWithType<TZoomLevel>(),
  mapContext(ButtonIconThemeContext),
  mapHovered,
  mapKeyboardFocused,
  mapPressed,
  mapWithProps(({
    isKeyboardFocused,
    isPressed,
    isHovered,
    backgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    iconColor,
    hoveredIconColor,
    pressedIconColor,
    focusedBorderColor,
  }) => ({
    borderColor: isKeyboardFocused
      ? focusedBorderColor
      : TRANSPARENT,
    backgroundColor: elegir(
      isPressed,
      pressedBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      true,
      backgroundColor
    ),
    color: elegir(
      isPressed,
      pressedIconColor,
      isHovered,
      hoveredIconColor,
      true,
      iconColor
    ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  backgroundColor,
  borderColor,
  isHovered,
  TextThemeProvider,
  onPress,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  children,
}) => (
  <SizeBlock width={WIDTH} height={HEIGHT}>
    {isHovered && (
      <Tooltip>
        Reset transform
      </Tooltip>
    )}
    <Layout>
      <Layout_Item hAlign="right">
        <SizeButton
          onPress={onPress}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <TextThemeProvider>
            <Layout hPadding={10} spaceBetween={5}>
              <SizeBorder
                color={borderColor}
                radius={BORDER_RADIUS}
                width={BORDER_WIDTH}
                overflow={BORDER_OVERFLOW}
              />
              <SizeBackground
                color={backgroundColor}
                radius={RADIUS}
              />
              <Layout_Item vAlign="center">
                <SizeText>
                  {children}
                </SizeText>
              </Layout_Item>

              <Layout_Item vAlign="center">
                <SizeContent>
                  <IconResetTransform/>
                </SizeContent>
              </Layout_Item>
            </Layout>
          </TextThemeProvider>
        </SizeButton>
      </Layout_Item>
    </Layout>
  </SizeBlock>
))

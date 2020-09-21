import { Block, InlineBlock } from '@revert/block'
import { Button } from '@revert/button'
import { Layout, Layout_Item } from '@revert/layout'
import { TextThemeContext } from '@revert/text'
import { elegir } from 'elegir'
import React from 'react'
import { component, startWithType, mapHovered, mapContext, mapKeyboardFocused, mapPressed, mapWithProps } from 'refun'
import type { TMapHovered, TMapKeyboardFocused } from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { Background } from '../background'
import { Border } from '../border'
import { IconResetTransform } from '../icons'
import { Text } from '../text'
import { ButtonIconThemeContext } from '../theme-context'
import { Tooltip } from '../tooltip'

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
      : COLOR_TRANSPARENT,
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
  <Block width={WIDTH} height={HEIGHT}>
    {isHovered && (
      <Tooltip>
        Reset transform
      </Tooltip>
    )}
    <Layout>
      <Layout_Item hAlign="right">
        <Button
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
              <Border
                color={borderColor}
                radius={BORDER_RADIUS}
                borderWidth={BORDER_WIDTH}
                overflow={BORDER_OVERFLOW}
              />
              <Background
                color={backgroundColor}
                radius={RADIUS}
              />
              <Layout_Item vAlign="center">
                <Text>
                  {children}
                </Text>
              </Layout_Item>

              <Layout_Item vAlign="center">
                <InlineBlock>
                  <IconResetTransform/>
                </InlineBlock>
              </Layout_Item>
            </Layout>
          </TextThemeProvider>
        </Button>
      </Layout_Item>
    </Layout>
  </Block>
))

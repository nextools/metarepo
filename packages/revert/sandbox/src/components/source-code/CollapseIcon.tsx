import { PrimitiveBlock } from '@revert/block'
import { PrimitiveBorder } from '@revert/border'
import { PrimitiveButton } from '@revert/button'
import { PrimitiveTransform } from '@revert/transform'
import { elegir } from 'elegir'
import React from 'react'
import { startWithType, mapKeyboardFocused, mapHovered, mapPressed, mapContext, pureComponent, mapWithProps } from 'refun'
import type { TMapHovered, TMapPressed, TMapKeyboardFocused } from 'refun'
import { TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { AnimationValue } from '../animation'
import { IconSourceCollapseArrowDownSmall } from '../icons'
import { ThemeContext, TextThemeContext } from '../theme-context'

const RADIUS = 10
const BORDER_OVERFLOW = 4
const BORDER_WIDTH = 2
const SIZE = 12

export type TCollapseIcon = {
  left: number,
  top: number,
  isCollapsed: boolean,
  onPress: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const CollapseIcon = pureComponent(
  startWithType<TCollapseIcon>(),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({ isKeyboardFocused, theme }) => ({
    borderColor: elegir(
      isKeyboardFocused,
      theme.sourceCodeCollapseIconFocusedBorderColor,
      true,
      TRANSPARENT
    ),
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ isPressed, isHovered, theme }) => ({
    color: elegir(
      isPressed,
      theme.sourceCodeCollapseIconPressedColor,
      isHovered,
      theme.sourceCodeCollapseIconHoveredColor,
      true,
      theme.sourceCodeCollapseIconColor
    ),
  }))
)(({
  left,
  top,
  borderColor,
  IconThemeProvider,
  isCollapsed,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onFocus,
  onBlur,
}) => (
  <PrimitiveBlock left={left} top={top} width={SIZE} height={SIZE}>
    <PrimitiveBorder
      color={borderColor}
      borderWidth={BORDER_WIDTH}
      radius={RADIUS}
      overflow={BORDER_OVERFLOW}
    />
    <PrimitiveButton
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <IconThemeProvider>
        <AnimationValue toValue={isCollapsed ? -90 : 0} time={200}>
          {(rotate) => (
            <PrimitiveTransform rotate={rotate}>
              <PrimitiveBlock width={SIZE} height={SIZE} shouldFlow>
                <IconSourceCollapseArrowDownSmall/>
              </PrimitiveBlock>
            </PrimitiveTransform>
          )}
        </AnimationValue>
      </IconThemeProvider>
    </PrimitiveButton>
  </PrimitiveBlock>
))

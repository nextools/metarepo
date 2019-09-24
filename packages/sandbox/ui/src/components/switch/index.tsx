import React from 'react'
import { elegir } from 'elegir'
import {
  mapWithProps,
  startWithType,
  mapHovered,
  TMapHovered,
  mapPressed,
  TMapPressed,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  pureComponent,
  mapState,
  mapContext,
} from 'refun'
import { Checkbox } from '@primitives/checkbox'
import { Block } from '@primitives/block'
import { Size } from '@primitives/size'
import { Background } from '../background'
import { Border } from '../border'
import { Text } from '../text'
import { TPosition } from '../../types'
import { mapStoreState } from '../../store'
import { ThemeContext } from '../themes'

const WIDTH = 44
const HEIGHT = 34
const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const RADIUS = 5
const BORDER_RADIUS = RADIUS + BORDER_OVERFLOW

export const switchWidth = WIDTH
export const switchHeight = HEIGHT

export type TSwitch = {
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused
  & TPosition

export const Switch = pureComponent(
  startWithType<TSwitch>(),
  mapContext(ThemeContext),
  mapStoreState(({ themeName }) => ({ themeName }), ['themeName']),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({ theme, themeName, isChecked, isHovered, isPressed, isKeyboardFocused }) => {
    const selectedTheme = theme[themeName]

    return {
      yesBackgroundColor: elegir(
        isPressed && isChecked,
        selectedTheme.foregroundActivePressed,
        isPressed,
        selectedTheme.foregroundPressed,
        isHovered && isChecked,
        selectedTheme.foregroundActiveHover,
        isHovered,
        selectedTheme.foregroundHover,
        isChecked,
        selectedTheme.foregroundActive,
        true,
        selectedTheme.foreground
      ),
      noBackgroundColor: elegir(
        isPressed && !isChecked,
        selectedTheme.foregroundActivePressed,
        isPressed,
        selectedTheme.foregroundPressed,
        isHovered && !isChecked,
        selectedTheme.foregroundActiveHover,
        isHovered,
        selectedTheme.foregroundHover,
        !isChecked,
        selectedTheme.foregroundActive,
        true,
        selectedTheme.foreground
      ),
      borderColor: elegir(
        isKeyboardFocused && isChecked,
        selectedTheme.outlineActiveFocus,
        isKeyboardFocused,
        selectedTheme.outlineIdleFocus,
        true,
        selectedTheme.foregroundTransparent
      ),
      yesTextColor: isChecked ? selectedTheme.textInverted : selectedTheme.text,
      noTextColor: isChecked ? selectedTheme.text : selectedTheme.textInverted,
    }
  }),
  mapState('yesSize', 'setYesSize', () => ({
    width: 0,
    height: 0,
  }), []),
  mapState('noSize', 'setNoSize', () => ({
    width: 0,
    height: 0,
  }), []),
  mapWithProps(({ yesSize, noSize }) => ({
    yesLeft: (WIDTH - yesSize.width) / 2,
    yesTop: yesSize.width === 0 ? 650 : (HEIGHT - yesSize.height) / 2,
    noLeft: WIDTH + (WIDTH - noSize.width) / 2,
    noTop: (HEIGHT - noSize.height) / 2,
  }))
)(({
  left,
  top,
  yesLeft,
  yesTop,
  setYesSize,
  noLeft,
  noTop,
  setNoSize,
  isChecked,
  yesBackgroundColor,
  noBackgroundColor,
  yesTextColor,
  noTextColor,
  borderColor,
  onToggle,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Block isFloating left={left} top={top} width={WIDTH * 2} height={HEIGHT}>
    <Border
      color={borderColor}
      overflow={BORDER_OVERFLOW}
      topLeftRadius={BORDER_RADIUS}
      topRightRadius={BORDER_RADIUS}
      bottomLeftRadius={BORDER_RADIUS}
      bottomRightRadius={BORDER_RADIUS}
      topWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
    />

    <Block isFloating left={0} top={0} width={WIDTH} height={HEIGHT}>
      <Background
        topLeftRadius={RADIUS}
        bottomLeftRadius={RADIUS}
        color={yesBackgroundColor}
      />
    </Block>

    <Block isFloating left={yesLeft} top={yesTop}>
      <Size onChange={setYesSize}>
        <Text color={yesTextColor}>
          yes
        </Text>
      </Size>
    </Block>

    <Block isFloating left={WIDTH} top={0} width={WIDTH} height={HEIGHT}>
      <Background
        topRightRadius={RADIUS}
        bottomRightRadius={RADIUS}
        color={noBackgroundColor}
      />
    </Block>

    <Block isFloating left={noLeft} top={noTop}>
      <Size onChange={setNoSize}>
        <Text color={noTextColor}>
          no
        </Text>
      </Size>
    </Block>

    <Checkbox
      onToggle={onToggle}
      isChecked={isChecked}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  </Block>
))

Switch.displayName = 'Switch'

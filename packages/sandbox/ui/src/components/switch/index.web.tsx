import React from 'react'
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
  mapContext,
} from 'refun'
import { Transform } from '@primitives/transform'
import { elegir } from 'elegir'
import { AnimationValue } from '../animation'
import { PrimitiveBlock } from '../primitive-block'
import { PrimitiveBorder } from '../primitive-border'
import { PrimitiveBackground } from '../primitive-background'
import { SizeCheckbox } from '../size-checkbox'
import { SYMBOL_SWITCH } from '../../symbols'
import { SizeBlock } from '../size-block'
import { SwitchThemeContext } from '../theme-context'
import { TRANSPARENT } from '../../colors'

const SWITCH_TIME = 100
const WIDTH = 36
const HEIGHT = 20
const RADIUS = HEIGHT / 2
const KNOB_SIZE = 14
const KNOB_RADIUS = KNOB_SIZE / 2
const KNOB_UNCHECKED_OFFSET = (HEIGHT - KNOB_SIZE) / 2
const KNOB_CHECKED_OFFSET = WIDTH - KNOB_UNCHECKED_OFFSET - KNOB_SIZE
const KNOB_TOP_OFFSET = KNOB_UNCHECKED_OFFSET
const KEYBOARD_BORDER_OFFSET = 4
const KEYBOARD_BORDER_WIDTH = 2
const KEYBOARD_BORDER_RADIUS = RADIUS + KEYBOARD_BORDER_OFFSET

export type TSwitch = {
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Switch = pureComponent(
  startWithType<TSwitch>(),
  mapContext(SwitchThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
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
    focusedOuterBorderColor,
    activeFocusedOuterBorderColor,
    iconColor,
    activeIconColor,
    hoveredIconColor,
    activeHoveredIconColor,
    pressedIconColor,
    activePressedIconColor,
  }) => ({
    leftOffset: isChecked ? KNOB_CHECKED_OFFSET : KNOB_UNCHECKED_OFFSET,
    backgroundColor: elegir(
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
    keyboardBorderColor: elegir(
      isChecked && isKeyboardFocused,
      activeFocusedOuterBorderColor,
      isKeyboardFocused,
      focusedOuterBorderColor,
      true,
      TRANSPARENT
    ),
    knobColor: elegir(
      isChecked && isPressed,
      activePressedIconColor,
      isPressed,
      pressedIconColor,
      isChecked && isHovered,
      activeHoveredIconColor,
      isHovered,
      hoveredIconColor,
      isChecked,
      activeIconColor,
      true,
      iconColor
    ),
  }))
)(({
  leftOffset,
  isChecked,
  knobColor,
  backgroundColor,
  keyboardBorderColor,
  onToggle,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <SizeBlock width={WIDTH} height={HEIGHT}>
    <PrimitiveBackground
      color={backgroundColor}
      radius={RADIUS}
    />
    <PrimitiveBorder
      color={keyboardBorderColor}
      radius={KEYBOARD_BORDER_RADIUS}
      width={KEYBOARD_BORDER_WIDTH}
      overflow={KEYBOARD_BORDER_OFFSET}
    />
    <SizeCheckbox
      onToggle={onToggle}
      isChecked={isChecked}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <AnimationValue toValue={leftOffset} time={SWITCH_TIME}>
        {(x) => (
          <Transform x={x} y={KNOB_TOP_OFFSET}>
            <PrimitiveBlock width={KNOB_SIZE} height={KNOB_SIZE} shouldFlow>
              <PrimitiveBackground
                color={knobColor}
                radius={KNOB_RADIUS}
              />
            </PrimitiveBlock>
          </Transform>
        )}
      </AnimationValue>
    </SizeCheckbox>
  </SizeBlock>
))

Switch.displayName = 'Switch'
Switch.componentSymbol = SYMBOL_SWITCH

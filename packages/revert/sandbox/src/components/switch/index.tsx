import { AnimationValue } from '@revert/animation'
import { PrimitiveBlock, Block } from '@revert/block'
import { Checkbox } from '@revert/checkbox'
import { PrimitiveTransform } from '@revert/transform'
import {
  mapWithProps,
  startWithType,
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  pureComponent,
  mapContext,
} from 'refun'
import type {
  TMapHovered,
  TMapPressed,
  TMapKeyboardFocused,
} from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { SYMBOL_SWITCH } from '../../symbols'
import { PrimitiveBackground } from '../background'
import { PrimitiveBorder } from '../border'
import { SwitchThemeContext } from '../theme-context'

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
    backgroundColor: (
      isChecked && isPressed ? activePressedBackgroundColor :
      isPressed ? pressedBackgroundColor :
      isChecked && isHovered ? activeHoveredBackgroundColor :
      isHovered ? hoveredBackgroundColor :
      isChecked ? activeBackgroundColor :
      backgroundColor
    ),
    keyboardBorderColor: (
      isChecked && isKeyboardFocused ? activeFocusedOuterBorderColor :
      isKeyboardFocused ? focusedOuterBorderColor :
      COLOR_TRANSPARENT
    ),
    knobColor: (
      isChecked && isPressed ? activePressedIconColor :
      isPressed ? pressedIconColor :
      isChecked && isHovered ? activeHoveredIconColor :
      isHovered ? hoveredIconColor :
      isChecked ? activeIconColor :
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
  <Block width={WIDTH} height={HEIGHT}>
    <PrimitiveBackground
      color={backgroundColor}
      radius={RADIUS}
    />
    <PrimitiveBorder
      color={keyboardBorderColor}
      radius={KEYBOARD_BORDER_RADIUS}
      borderWidth={KEYBOARD_BORDER_WIDTH}
      overflow={KEYBOARD_BORDER_OFFSET}
    />
    <Checkbox
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
          <PrimitiveTransform x={x} y={KNOB_TOP_OFFSET}>
            <PrimitiveBlock width={KNOB_SIZE} height={KNOB_SIZE} shouldFlow>
              <PrimitiveBackground
                color={knobColor}
                radius={KNOB_RADIUS}
              />
            </PrimitiveBlock>
          </PrimitiveTransform>
        )}
      </AnimationValue>
    </Checkbox>
  </Block>
))

Switch.displayName = 'Switch'
Switch.componentSymbol = SYMBOL_SWITCH

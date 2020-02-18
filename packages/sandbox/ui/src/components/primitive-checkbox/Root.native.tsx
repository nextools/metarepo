import React from 'react'
import { Switch, TouchableWithoutFeedback } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, startWithType } from 'refun'
import { PrimitiveBlock } from '../primitive-block'
import { TPrimitiveCheckbox } from './types'

const style = normalizeStyle({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
})

export const PrimitiveCheckbox = component(
  startWithType<TPrimitiveCheckbox>()
)(({
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  onToggle,
  onPressIn,
  onPressOut,
  children,
}) => (
  <TouchableWithoutFeedback
    accessibilityLabel={accessibilityLabel}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    disabled={isDisabled}
  >
    <PrimitiveBlock>
      {children}
      <Switch
        value={isChecked}
        disabled={isDisabled}
        testID={id}
        style={style}
        onValueChange={onToggle}
      />
    </PrimitiveBlock>
  </TouchableWithoutFeedback>
))

PrimitiveCheckbox.displayName = 'Checkbox'

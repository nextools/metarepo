import React from 'react'
import { Switch, TouchableWithoutFeedback } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, mapWithProps, startWithType } from 'refun'
import { Block } from '@primitives/block'
import { TCheckboxProps } from './types'

export const Checkbox = component(
  startWithType<TCheckboxProps>(),
  mapWithProps(() => ({
    style: normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
    }),
  }))
)(({
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  style,
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
    <Block shouldStretch>
      {children}
      <Switch
        value={isChecked}
        disabled={isDisabled}
        testID={id}
        style={style}
        onValueChange={onToggle}
      />
    </Block>
  </TouchableWithoutFeedback>
))

Checkbox.displayName = 'Checkbox'

import React from 'react'
import { Switch, TouchableWithoutFeedback } from 'react-native'
import { prefixStyle } from '@lada/prefix'
import { component, mapWithProps, startWithType } from 'refun'
import { TCheckboxProps } from './types'

export const Checkbox = component(
  startWithType<TCheckboxProps>(),
  mapWithProps(() => ({
    wrapperStyle: prefixStyle({
      position: 'relative',
      flexGrow: 1,
    }),
    switchStyle: prefixStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
    }),
  }))
)(
  'Checkbox',
  ({
    id,
    accessibilityLabel,
    isDisabled,
    isChecked,
    wrapperStyle,
    switchStyle,
    onToggle,
    onPressIn,
    onPressOut,
    children,
  }) => (
    <TouchableWithoutFeedback
      style={wrapperStyle}
      accessibilityLabel={accessibilityLabel}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
    >
      {children}
      <Switch
        value={isChecked}
        disabled={isDisabled}
        testID={id}
        style={switchStyle}
        onValueChange={onToggle}
      />
    </TouchableWithoutFeedback>
  )
)

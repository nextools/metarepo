import React from 'react'
import { Picker } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, mapWithProps, startWithType } from 'refun'
import { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>(),
  mapWithProps(({
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  }) => ({
    style: normalizeStyle({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      flexGrow: 1,
      flexShrink: 1,
      alignSelf: 'stretch',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      minWidth: 0,
    }),
  }))
)(({
  children,
  id,
  accessibilityLabel,
  isDisabled,
  style,
  value,
  onChange,
}) => (
  <Picker
    testID={id}
    enabled={!isDisabled}
    style={style}
    selectedValue={value}
    onValueChange={onChange}
    accessibilityLabel={accessibilityLabel}
  >
    {children}
  </Picker>
))

Select.displayName = 'Select'

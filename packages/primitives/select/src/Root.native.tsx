import React from 'react'
import { Picker } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, mapWithProps, startWithType } from 'refun'
import { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>(),
  mapWithProps(({
    size,
    family,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    weight,
  }) => ({
    style: normalizeStyle({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fontWeight: weight,
      fontSize: size,
      fontFamily: family,
      flexGrow: 1,
      flexShrink: 1,
      alignSelf: 'stretch',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      minWidth: 150,
    }),
  }))
)(
  'Select',
  ({
    children,
    id,
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
    >
      {children}
    </Picker>
  )
)

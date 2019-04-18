import React from 'react'
import { Picker } from 'react-native'
import { prefixStyle, TStyle } from '@lada/prefix'
import { component, mapWithProps, startWithType } from 'refun'
import { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>(),
  mapWithProps(({
    color,
    size,
    family,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    weight,
  }) => {
    const style: TStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      color,
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
      minWidth: 0,
      opacity: 0,
    }

    return ({
      style: prefixStyle(style),
    })
  })
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

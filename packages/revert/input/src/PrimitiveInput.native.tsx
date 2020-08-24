import { colorToString, isColor } from '@revert/color'
import React from 'react'
import { TextInput } from 'react-native'
import type { TextStyle } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import type { TInput } from './types'

export const PrimitiveInput = component(
  startWithType<TInput>(),
  mapHandlers({
    onChangeText: ({ onChange }) => (newValue: string) => onChange(newValue),
    onSubmitEditing: ({ onSubmit }) => () => {
      onSubmit?.()
    },
  }),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft,
    paddingRight,
  }) => {
    const style: TextStyle = {
      letterSpacing,
      lineHeight,
      fontFamily,
      fontWeight: String(fontWeight) as TextStyle['fontWeight'],
      fontSize,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    }

    if (isColor(color)) {
      style.color = colorToString(color)
    }

    return {
      style,
    }
  })
)(({
  id,
  accessibilityLabel,
  isDisabled,
  style,
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
}) => (
  <TextInput
    testID={id}
    accessibilityLabel={accessibilityLabel}
    underlineColorAndroid="rgba(0,0,0,0)"
    textAlignVertical="center"
    caretHidden={isDisabled}
    editable={!isDisabled}
    style={style}
    value={value}
    onFocus={onFocus}
    onBlur={onBlur}
    onChangeText={onChangeText}
    onSubmitEditing={onSubmitEditing}
  />
))

PrimitiveInput.displayName = 'PrimitiveInput'

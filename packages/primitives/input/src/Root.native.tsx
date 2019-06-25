import React from 'react'
import { TextInput } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers, mapDefaultProps } from 'refun'
import { normalizeStyle } from 'stili'
import { TInput } from './types'

export const Input = component(
  startWithType<TInput>(),
  mapDefaultProps({
    paddingTop: 0,
    paddingBottom: 0,
  }),
  mapHandlers({
    onChangeText: ({ onChange }) => (newValue: string) => onChange(newValue),
    onSubmitEditing: ({ onSubmit }) => () => {
      if (typeof onSubmit === 'function') {
        onSubmit()
      }
    },
  }),
  mapWithProps(
    ({
      color,
      letterSpacing,
      lineHeight,
      fontFamily,
      fontWeight,
      fontSize,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
    }) => ({
      style: normalizeStyle({
        letterSpacing,
        lineHeight,
        color,
        fontFamily,
        fontWeight,
        fontSize,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'stretch',
        minWidth: 0,
      }),
    })
  )
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

Input.displayName = 'Input'

import React from 'react'
import { TextInput } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { TInputProps } from './types'

export type TFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export const Input = component(
  startWithType<TInputProps>(),
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
      size,
      family,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      weight,
    }) => ({
      style: {
        letterSpacing,
        lineHeight,
        color,
        fontWeight: typeof weight !== 'undefined' ? String(weight) as TFontWeight : undefined,
        fontSize: size,
        fontFamily: family,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
      },
    })
  )
)('Input', ({ id, isDisabled, style, value, onChangeText, onSubmitEditing }) => (
  <TextInput
    testID={id}
    underlineColorAndroid="rgba(0,0,0,0)"
    caretHidden={isDisabled}
    editable={!isDisabled}
    style={style}
    value={value}
    onChangeText={onChangeText}
    onSubmitEditing={onSubmitEditing}
  />
))

import React from 'react'
import { TextInput } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers, mapDefaultProps } from 'refun'
import { TStyle } from '@lada/prefix'
import { TInput } from './types'

export type TFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

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
      size,
      family,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      weight,
    }) => {
      const style: TStyle = {
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
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'stretch',
        minWidth: 150,
      }

      return {
        style,
      }
    }
  )
)('Input', ({ id, isDisabled, style, value, onChangeText, onSubmitEditing, onFocus, onBlur }) => (
  <TextInput
    testID={id}
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

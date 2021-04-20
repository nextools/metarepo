import { colorToString } from '@revert/color'
import { TextInput } from 'react-native'
import type { TextStyle, KeyboardType } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveInput } from './types'

export const PrimitiveInput = component(
  startWithType<TPrimitiveInput>(),
  mapHandlers({
    onChangeText: ({ onChange }) => (newValue: string) => onChange(newValue),
    onSubmitEditing: ({ onSubmit }) => () => {
      onSubmit?.()
    },
  }),
  mapWithProps(({
    type = 'text',
    color = 0xff,
    left = 0,
    top = 0,
    width = '100%' as const,
    height = '100%' as const,
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
      fontSize,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      top,
      left,
      width,
      height,
      color: colorToString(color),
    }

    if (isNumber(fontWeight)) {
      style.fontWeight = String(fontWeight) as TextStyle['fontWeight']
    }

    const keyboardType: KeyboardType = (
      type === 'number' ? 'numeric' :
      type === 'tel' ? 'phone-pad' :
      type === 'email' ? 'email-address' :
      'default'
    )

    return {
      style,
      keyboardType,
      secureTextEntry: type === 'password',
    }
  })
)(({
  id,
  keyboardType,
  secureTextEntry,
  accessibilityLabel,
  isDisabled = false,
  style,
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
}) => (
  <TextInput
    testID={id}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
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

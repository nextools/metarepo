import React, { KeyboardEvent } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import { TInput } from './types'

export const Input = component(
  startWithType<TInput>(),
  mapHandlers({
    onChange: ({ onChange }) => (event: any) => onChange(event.target.value),
    onKeyPress: ({ onSubmit }) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && typeof onSubmit === 'function') {
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
    }) => {
      const style: TStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 0,
        color,
        fontFamily,
        fontWeight,
        fontSize,
        fontSmoothing: 'antialiased',
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'stretch',
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',
        appearance: 'none',
        boxSizing: 'border-box',
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        maxWidth: '100%',
        minWidth: 0,
      }

      if (isNumber(letterSpacing)) {
        style.letterSpacing = `${letterSpacing}px`
      }

      if (isNumber(lineHeight)) {
        style.lineHeight = `${lineHeight}px`
      }

      return {
        style: normalizeStyle(style),
      }
    }
  )
)(({
  id,
  accessibilityLabel,
  style,
  value,
  isDisabled,
  onChange,
  onKeyPress,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
}) => (
  <input
    id={id}
    aria-label={accessibilityLabel}
    disabled={isDisabled}
    style={style}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    onFocus={onFocus}
    onBlur={onBlur}
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
  />
))

Input.displayName = 'Input'

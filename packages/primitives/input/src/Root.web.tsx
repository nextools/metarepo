import React, { KeyboardEvent } from 'react'
import { prefixStyle, TStyle } from '@lada/prefix'
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
        border: 0,
        color,
        fontWeight: weight,
        fontSize: size,
        fontFamily: family,
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
        minWidth: 150,
      }

      if (isNumber(letterSpacing)) {
        style.letterSpacing = `${letterSpacing}px`
      }

      if (isNumber(lineHeight)) {
        style.lineHeight = `${lineHeight}px`
      }

      return {
        style: prefixStyle(style),
      }
    }
  )
)(
  'Input',
  ({
    id,
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
      disabled={isDisabled}
      style={style}
      size={1}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
    />
  )
)

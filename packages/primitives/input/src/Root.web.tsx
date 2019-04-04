import React, { KeyboardEvent } from 'react'
import { prefixStyle } from '@lada/prefix'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { TStyle } from '@lada/prefix'
import { isNumber } from 'tsfn'
import { TInputProps } from './types'

export const Input = component(
  startWithType<TInputProps>(),
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
      shouldStretch,
      minWidth,
      weight,
    }) => {
      const style: TStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 'none',
        color,
        fontWeight: weight,
        fontSize: size,
        fontFamily: family,
        fontSmoothing: 'antialiased',
        flexGrow: shouldStretch ? 1 : 0,
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',
        appearance: 'none',

        boxSizing: 'border-box',

        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,

        // IE 11 + flexbox fix
        maxWidth: '100%',
      }

      if (isNumber(letterSpacing)) {
        style.letterSpacing = `${letterSpacing}px`
      }

      if (isNumber(lineHeight)) {
        style.lineHeight = `${lineHeight}px`
      }

      if (isNumber(minWidth)) {
        style.minWidth = minWidth
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

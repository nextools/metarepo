import React, { KeyboardEvent } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import { colorToString, isColor } from '@revert/color'
import { TPrimitiveInput } from './types'

export const PrimitiveInput = component(
  startWithType<TPrimitiveInput>(),
  mapHandlers({
    onChange: ({ onChange }) => (e: any) => onChange(e.target.value),
    onKeyPress: ({ onSubmit }) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit?.()
      }
    },
  }),
  mapWithProps(({
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
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const style: TStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: 0,
      fontFamily,
      fontWeight,
      fontSize,
      fontSmoothing: 'antialiased',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      appearance: 'none',
      boxSizing: 'border-box',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      left,
      top,
      width: isNumber(width) ? width : '100%',
      height: isNumber(height) ? height : '100%',
    }

    if (isColor(color)) {
      style.color = colorToString(color)
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
  })
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
  onPointerEnter,
  onPointerLeave,
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
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
  />
))

PrimitiveInput.displayName = 'PrimitiveInput'

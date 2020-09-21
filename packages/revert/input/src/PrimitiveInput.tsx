import { colorToString } from '@revert/color'
import React from 'react'
import type { KeyboardEvent, CSSProperties } from 'react'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveInput } from './types'

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
    color = 0xff,
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
    const style: CSSProperties = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: 0,
      fontFamily,
      fontWeight,
      fontSize,
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
      width: width ?? '100%',
      height: height ?? '100%',
      color: colorToString(color),
    }

    if (isNumber(letterSpacing)) {
      style.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = `${lineHeight}px`
    }

    return {
      style,
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

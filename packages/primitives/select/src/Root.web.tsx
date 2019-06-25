import React from 'react'
import { normalizeStyle } from 'stili'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>(),
  mapHandlers({
    onChange: ({ onChange }) => (event: any) => onChange(event.target.value),
  }),
  mapWithProps(({
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  }) => ({
    style: normalizeStyle({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: 0,
      boxSizing: 'border-box',
      fontSmoothing: 'antialiased',
      flexGrow: 1,
      flexShrink: 1,
      alignSelf: 'stretch',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      minWidth: 0,
      maxWidth: '100%',
      opacity: 0,
      appearance: 'none',
    }),
  }))
)(({
  children,
  id,
  accessibilityLabel,
  isDisabled,
  style,
  value,
  onChange,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
}) => (
  <select
    id={id}
    aria-label={accessibilityLabel}
    disabled={isDisabled}
    style={style}
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
  >
    {children}
  </select>
))

Select.displayName = 'Select'

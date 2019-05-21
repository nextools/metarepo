import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import { TSelect } from './types'


export const Select = component(
  startWithType<TSelect>(),
  mapHandlers({
    onChange: ({ onChange }) => (event: any) => onChange(event.target.value),
  }),
  mapWithProps(({
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
      boxSizing: 'border-box',
      fontWeight: weight,
      fontSize: size,
      fontFamily: family,
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
      minWidth: 150,
      maxWidth: '100%',
      opacity: 0,
      appearance: 'none',
    }

    if (isNumber(letterSpacing)) {
      style.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = `${lineHeight}px`
    }

    return ({
      style: normalizeStyle(style),
    })
  })
)(
  'Select',
  ({
    children,
    id,
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
  )
)

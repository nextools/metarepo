import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { TPrimitiveButton } from './types'

export const PrimitiveButton = component(
  startWithType<TPrimitiveButton>(),
  mapDefaultProps({
    left: 0,
    top: 0,
  }),
  mapWithProps(({ left, top, width, height, isDisabled }) => ({
    styles: normalizeStyle({
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      right: 0,
      bottom: 0,
      width: width || '100%',
      height: height || '100%',
      cursor: isDisabled ? 'auto' : 'pointer',
      boxSizing: 'border-box',
      alignSelf: 'stretch',
      border: 0,
      margin: 0,
      outline: 0,
      padding: 0,
      tapHighlightColor: 'rgba(255, 255, 255, 0)',
      userSelect: 'none',
      textAlign: 'initial',
      appearance: 'none',
      background: 'none',
    }),
  }))
)(({
  id,
  accessibilityLabel,
  isDisabled,
  styles,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
}) => (
  <button
    aria-label={accessibilityLabel}
    disabled={isDisabled}
    id={id}
    onClick={onPress}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
    onFocus={onFocus}
    onBlur={onBlur}
    style={styles}
  >
    {children}
  </button>
))

PrimitiveButton.displayName = 'PrimitiveButton'

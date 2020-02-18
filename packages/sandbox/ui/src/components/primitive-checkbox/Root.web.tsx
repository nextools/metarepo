import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { PrimitiveBlock } from '../primitive-block'
import { TPrimitiveCheckbox } from './types'

export const PrimitiveCheckbox = component(
  startWithType<TPrimitiveCheckbox>(),
  mapWithPropsMemo(({ isDisabled }) => ({
    style: normalizeStyle({
      position: 'absolute',
      appearance: 'none',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      top: 0,
      left: 0,
      opacity: 0,
      cursor: isDisabled ? 'auto' : 'pointer',
      tapHighlightColor: 'rgba(255, 255, 255, 0)',
    }),
  }), ['isDisabled'])
)(({
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  style,
  onToggle,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
}) => (
  <PrimitiveBlock left={0} top={0} right={0} bottom={0}>
    {children}
    <input
      type="checkbox"
      style={style}
      checked={isChecked}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      id={id}
      onChange={onToggle}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </PrimitiveBlock>
))

PrimitiveCheckbox.displayName = 'PrimitiveCheckbox'

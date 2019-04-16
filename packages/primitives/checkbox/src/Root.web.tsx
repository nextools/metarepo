import React from 'react'
import { prefixStyle } from '@lada/prefix'
import { component, mapWithProps, startWithType } from 'refun'
import { TCheckboxProps } from './types'

export const Checkbox = component(
  startWithType<TCheckboxProps>(),
  mapWithProps(({ isDisabled }) => ({
    wrapperStyle: prefixStyle({
      position: 'relative',
      flexGrow: 1,
    }),
    checkboxStyle: prefixStyle({
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
  }))
)(
  'Checkbox',
  ({
    id,
    accessibilityLabel,
    isDisabled,
    isChecked,
    wrapperStyle,
    checkboxStyle,
    onToggle,
    onPointerEnter,
    onPointerLeave,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    children,
  }) => (
    <div style={wrapperStyle}>
      {children}
      <input
        type="checkbox"
        style={checkboxStyle}
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
    </div>
  )
)

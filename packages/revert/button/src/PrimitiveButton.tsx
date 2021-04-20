import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import type { TPrimitiveButton } from './types'

export const PrimitiveButton = component(
  startWithType<TPrimitiveButton>(),
  mapWithProps(({
    left = 0,
    top = 0,
    width,
    height,
    isDisabled = false,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      right: 0,
      bottom: 0,
      width: width ?? '100%',
      height: height ?? '100%',
      cursor: isDisabled ? 'auto' : 'pointer',
      boxSizing: 'border-box',
      alignSelf: 'stretch',
      border: 0,
      margin: 0,
      outline: 0,
      padding: 0,
      WebkitTapHighlightColor: 'rgba(255, 255, 255, 0)',
      userSelect: 'none',
      textAlign: 'initial',
      appearance: 'none',
      background: 'none',
    }

    return {
      style,
    }
  })
)(({
  id,
  accessibilityLabel,
  isDisabled,
  style,
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
    style={style}
  >
    {children}
  </button>
))

PrimitiveButton.displayName = 'PrimitiveButton'

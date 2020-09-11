import type { CSSProperties } from 'react'
import React from 'react'
import { component, startWithType } from 'refun'
import { UNDEFINED } from 'tsfn'
import type { TLink } from './types'

const style: CSSProperties = {
  display: 'inline-block',
  textDecoration: 'none',
}

export const PrimitiveLink = component(
  startWithType<TLink>()
)(({
  id,
  isDisabled,
  children,
  href,
  tabIndex,
  target,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <a
    id={id}
    href={href}
    target={target}
    tabIndex={tabIndex}
    style={style}
    onFocus={onFocus}
    onBlur={onBlur}
    onClick={isDisabled ? UNDEFINED : onPress}
    onMouseDown={isDisabled ? UNDEFINED : onPressIn}
    onMouseUp={isDisabled ? UNDEFINED : onPressOut}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
  >
    {children}
  </a>
))

PrimitiveLink.displayName = 'PrimitiveLink'

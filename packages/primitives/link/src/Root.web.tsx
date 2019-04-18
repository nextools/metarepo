import React, { FC } from 'react'
import { TLink } from './types'

const defaultStyles = {
  textDecoration: 'none',
}

export const Link: FC<TLink> = ({
  children,
  href,
  id,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  tabIndex,
  target,
}) => (
  <a
    href={href}
    id={id}
    onBlur={onBlur}
    onClick={onPress}
    onFocus={onFocus}
    onMouseDown={onPressIn}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
    onMouseUp={onPressOut}
    style={defaultStyles}
    tabIndex={tabIndex}
    target={target}
  >
    {children}
  </a>
)

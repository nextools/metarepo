import React, { FC } from 'react'
import { normalizeStyle } from 'stili'
import { TLink } from './types'

const style = normalizeStyle({
  textDecoration: 'none',
})

export const Link: FC<TLink> = ({
  id,
  href,
  tabIndex,
  target,
  children,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  rel,
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
    style={style}
    tabIndex={tabIndex}
    target={target}
    rel={rel}
  >
    {children}
  </a>
)

Link.displayName = 'Link'

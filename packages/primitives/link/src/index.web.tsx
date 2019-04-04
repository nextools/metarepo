import React, { FC } from 'react'
import { TLinkProps } from './types'

export * from './types'

const Link: FC<TLinkProps> = ({
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
    style={{ textDecoration: 'none' }} // TODO 👀
    tabIndex={tabIndex}
    target={target}
  >
    {children}
  </a>
)

Link.displayName = 'Link'

export { Link }

import type { CSSProperties, FC } from 'react'
import { UNDEFINED } from 'tsfn'
import type { TLink } from './types'

const style: CSSProperties = {
  display: 'inline-block',
  textDecoration: 'none',
}

export const PrimitiveLink: FC<TLink> = ({
  id,
  isDisabled = false,
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
)

PrimitiveLink.displayName = 'PrimitiveLink'

import React, { FC } from 'react'
import { normalizeStyle } from 'stili'
import { TLink, TRel, TTarget } from './types'

const style = normalizeStyle({
  textDecoration: 'none',
})

const getRel = (list?: TRel[], target?: TTarget) => {
  if (Array.isArray(list)) {
    const nonDuplicatesList = new Set(list)

    return [...nonDuplicatesList].reduce((finalValue, currentValue) => `${finalValue} ${currentValue}`, '')
  }

  return target === '_blank' ? 'noopener' : undefined
}

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
    rel={getRel(rel, target)}
  >
    {children}
  </a>
)

Link.displayName = 'Link'

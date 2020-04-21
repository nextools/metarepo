import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { normalizeStyle } from 'stili'
import { colorToString } from '@revert/color'
import { PrimitiveText } from '@revert/text'
import { TLink } from './types'

export const PrimitiveLink = component(
  startWithType<TLink>(),
  mapWithPropsMemo(({
    isUnderlined = false,
    color,
  }) => ({
    style: normalizeStyle({
      color: colorToString(color),
      textDecoration: isUnderlined ? 'underlined' : 'none',
    }),
  }), ['isUnderlined', 'color'])
)(({
  id,
  href,
  tabIndex,
  target,
  style,
  shouldHideOverflow,
  shouldPreventWrap,
  children,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
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
  >
    <PrimitiveText
      shouldHideOverflow={shouldHideOverflow}
      shouldPreventWrap={shouldPreventWrap}
    >
      {children}
    </PrimitiveText>
  </a>
))

PrimitiveLink.displayName = 'PrimitiveLink'

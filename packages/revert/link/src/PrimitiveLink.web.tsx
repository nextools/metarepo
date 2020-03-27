import React from 'react'
import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { normalizeStyle } from 'stili'
import { InlineBlock } from '@revert/block'
import { colorToString } from '@revert/color'
import { PrimitiveText } from '@revert/text'
import { TLink } from './types'

export const PrimitiveLink = component(
  startWithType<TLink>(),
  mapDefaultProps({
    isUnderlined: false,
  }),
  mapWithPropsMemo(({ isUnderlined, color }) => ({
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
  <InlineBlock>
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
  </InlineBlock>
))

PrimitiveLink.displayName = 'PrimitiveLink'

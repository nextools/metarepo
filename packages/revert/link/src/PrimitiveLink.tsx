import { PrimitiveText } from '@revert/text'
import React from 'react'
import { component, startWithType } from 'refun'
import { UNDEFINED } from 'tsfn'
import type { TLink } from './types'

export const PrimitiveLink = component(
  startWithType<TLink>()
)(({
  id,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  isUnderlined,
  letterSpacing,
  lineHeight,
  shouldHideOverflow,
  shouldPreserveWhitespace,
  shouldPreventSelection,
  shouldPreventWrap,
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
    href={href}
    target={target}
    id={id}
    tabIndex={tabIndex}
    onFocus={onFocus}
    onBlur={onBlur}
    onClick={isDisabled ? UNDEFINED : onPress}
    onMouseDown={isDisabled ? UNDEFINED : onPressIn}
    onMouseUp={isDisabled ? UNDEFINED : onPressOut}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
  >
    <PrimitiveText
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      isUnderlined={isUnderlined}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      shouldHideOverflow={shouldHideOverflow}
      shouldPreserveWhitespace={shouldPreserveWhitespace}
      shouldPreventSelection={shouldPreventSelection}
      shouldPreventWrap={shouldPreventWrap}
    >
      {children}
    </PrimitiveText>
  </a>
))

PrimitiveLink.displayName = 'PrimitiveLink'

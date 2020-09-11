import { isColor, colorToString } from '@revert/color'
import React from 'react'
import type { CSSProperties } from 'react'
import { component, mapWithProps, startWithType } from 'refun'
import { isNumber } from 'tsfn'
import type { TText } from './types'

export const PrimitiveText = component(
  startWithType<TText>(),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    isUnderline = false,
    isItalic = false,
    isStrikeThrough = false,
    shouldPreserveWhitespace = false,
    shouldPreventSelection = false,
    shouldPreventWrap = false,
    shouldHideOverflow = false,
  }) => {
    const style: CSSProperties = {
      fontFamily,
      fontWeight,
      fontSize,
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      minWidth: 0,
      maxWidth: '100%',
    }

    if (isColor(color)) {
      style.color = colorToString(color)
    }

    if (shouldPreserveWhitespace) {
      style.whiteSpace = 'pre'
      style.flexShrink = 0
    }

    if (shouldPreventWrap) {
      style.whiteSpace = 'nowrap'
      style.flexShrink = 0
    }

    if (shouldPreventSelection) {
      style.userSelect = 'none'
    }

    if (shouldHideOverflow) {
      style.whiteSpace = 'nowrap'
      style.textOverflow = 'ellipsis'
      style.overflow = 'hidden'
      style.flexShrink = 0
    }

    if (isNumber(letterSpacing)) {
      style.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = `${lineHeight}px`
    }

    if (isUnderline && isStrikeThrough) {
      style.textDecorationLine = 'underline line-through'
    } else if (isUnderline) {
      style.textDecoration = 'underline'
    } else if (isStrikeThrough) {
      style.textDecoration = 'line-through'
    }

    if (isItalic) {
      style.fontStyle = 'italic'
    }

    return {
      style,
    }
  })
)(({ children, style, id }) => (
  <span
    id={id}
    style={style}
  >
    {children}
  </span>
))

PrimitiveText.displayName = 'PrimitiveText'

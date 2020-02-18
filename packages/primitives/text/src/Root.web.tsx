import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import {
  component,
  mapDefaultProps,
  mapWithProps,
  startWithType,
} from 'refun'
import { isNumber } from 'tsfn'
import { colorToString, isColor } from 'colorido'
import { elegir } from 'elegir'
import { TText } from './types'

export const Text = component(
  startWithType<TText>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    shouldHideOverflow: false,
    isUnderlined: false,
    role: 'none',
  }),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    isUnderlined,
    shouldPreserveWhitespace,
    shouldPreventSelection,
    shouldPreventWrap,
    shouldHideOverflow,
    role,
  }) => {
    const style: TStyle = {
      fontFamily,
      fontWeight,
      fontSize,
      fontSmoothing: 'antialiased',
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

    if (isUnderlined) {
      style.textDecoration = 'underline'
    }

    if (role === 'paragraph') {
      style.display = 'inline'
    }

    return {
      style: normalizeStyle(style),
    }
  })
)(({ children, style, id, role }) => (
  elegir(
    role === 'paragraph',
    <p id={id} style={style}>{children}</p>,

    role === 'important',
    <strong id={id} style={style}>{children}</strong>,

    role === 'emphasis',
    <em id={id} style={style}>{children}</em>,

    role === 'none' || true,
    <span id={id} style={style}>{children}</span>
  )
))

Text.displayName = 'Text'

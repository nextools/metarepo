import { createElement } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import {
  component,
  mapDefaultProps,
  mapWithProps,
  startWithType,
} from 'refun'
import { elegir } from 'elegir'
import { isNumber } from 'tsfn'
import { TTextProps } from './types'
import { TextRoles } from './roles'

export const Text = component(
  startWithType<TTextProps>(),
  mapDefaultProps({
    role: TextRoles.NONE,
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    sholdHideOverflow: false,
  }),
  mapWithProps(({
    color,
    role,
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
  }) => {
    const tag = elegir(
      role === TextRoles.HEADING1,
      'h1',
      role === TextRoles.HEADING2,
      'h2',
      role === TextRoles.HEADING3,
      'h3',
      role === TextRoles.HEADING4,
      'h4',
      role === TextRoles.HEADING5,
      'h5',
      role === TextRoles.HEADING6,
      'h6',
      role === TextRoles.NONE,
      'span',
      true,
      'span'
    )
    const style: TStyle = {
      color,
      fontFamily,
      fontWeight,
      fontSize,
      fontSmoothing: 'antialiased',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      minWidth: 0,
      maxWidth: '100%',
    }

    if (shouldPreserveWhitespace) {
      style.whiteSpace = 'pre'
    }

    if (shouldPreventWrap) {
      style.whiteSpace = 'nowrap'
    }

    if (shouldPreventSelection) {
      style.userSelect = 'none'
    }

    if (shouldHideOverflow) {
      style.whiteSpace = 'nowrap'
      style.textOverflow = 'ellipsis'
      style.overflow = 'hidden'
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

    return {
      style: normalizeStyle(style),
      tag,
    }
  })
)(({ tag, children, style, id }) => (
  createElement(tag, { style, id }, children)
))

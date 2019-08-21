import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import {
  component,
  mapDefaultProps,
  mapWithProps,
  startWithType,
} from 'refun'
import { isNumber } from 'tsfn'
import { TColor, colorToString } from 'colorido'
import { COLOR_BLACK } from '../config'

export type TTextProps = {
  id?: string,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  isUnderlined?: boolean,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
}

export const Text = component(
  startWithType<TTextProps>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    sholdHideOverflow: false,
    isUnderlined: false,
    color: COLOR_BLACK,
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
  }) => {
    const style: TStyle = {
      color: colorToString(color),
      fontFamily,
      fontWeight,
      fontSize,
      fontSmoothing: 'antialiased',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      display: 'block',
      position: 'relative',
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
    }
  })
)(({ children, style, id }) => (
  <span id={id} style={style}>{children}</span>
))

Text.displayName = 'Text'

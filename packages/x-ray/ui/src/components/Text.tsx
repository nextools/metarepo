import { TColor, colorToString } from 'colorido'
import React from 'react'
import { component, mapDefaultProps, mapWithProps, startWithType } from 'refun'
import { normalizeWebStyle, TStyle } from 'stili'
import { isNumber } from 'tsfn'
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
    shouldHideOverflow: false,
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
      _webOnly: {
        display: 'block',
        fontSmoothing: 'antialiased',
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',
      },
      color: colorToString(color),
      fontFamily,
      fontWeight,
      fontSize,
      position: 'relative',
    }

    if (shouldPreserveWhitespace) {
      style._webOnly!.whiteSpace = 'pre'
    }

    if (shouldPreventWrap) {
      style._webOnly!.whiteSpace = 'nowrap'
    }

    if (shouldPreventSelection) {
      style._webOnly!.userSelect = 'none'
    }

    if (shouldHideOverflow) {
      style._webOnly!.whiteSpace = 'nowrap'
      style._webOnly!.textOverflow = 'ellipsis'
      style.overflow = 'hidden'
    }

    if (isNumber(letterSpacing)) {
      style._webOnly!.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = lineHeight
    }

    if (isUnderlined) {
      style._webOnly!.textDecoration = 'underline'
    }

    return {
      style: normalizeWebStyle(style),
    }
  })
)(({ children, style, id }) => (
  <span id={id} style={style}>{children}</span>
))

Text.displayName = 'Text'

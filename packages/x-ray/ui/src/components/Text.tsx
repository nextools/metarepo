import { colorToString } from '@revert/color'
import type { TColor } from '@revert/color'
import type { CSSProperties } from 'react'
import { component, mapDefaultProps, mapWithProps, startWithType } from 'refun'
import { isNumber } from 'tsfn'
import { COLOR_BLACK } from '../config'

export type TTextProps = {
  id?: string,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: CSSProperties['fontWeight'],
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
    const style: CSSProperties = {
      display: 'block',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      color: colorToString(color),
      fontFamily,
      fontWeight,
      fontSize,
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
      style,
    }
  })
)(({ children, style, id }) => (
  <span id={id} style={style}>{children}</span>
))

Text.displayName = 'Text'

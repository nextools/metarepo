import { createElement } from 'react'
import { prefixStyle, TStyle } from '@lada/prefix'
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
  }),
  mapWithProps(({
    color,
    role,
    letterSpacing,
    lineHeight,
    size,
    family,
    weight,
    shouldPreserveWhitespace,
    shouldPreventSelection,
    shouldPreventWrap,
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
    const styles: TStyle = {
      color,
      fontWeight: weight,
      fontSize: size,
      fontFamily: family,
      fontSmoothing: 'antialiased',
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      minWidth: 0,
      maxWidth: '100%',
    }

    if (shouldPreserveWhitespace) {
      styles.whiteSpace = 'pre'
    }

    if (shouldPreventWrap) {
      styles.whiteSpace = 'nowrap'
    }

    if (shouldPreventSelection) {
      styles.userSelect = 'none'
    }

    if (isNumber(letterSpacing)) {
      styles.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      styles.lineHeight = `${lineHeight}px`
    }

    return {
      style: prefixStyle(styles),
      tag,
    }
  })
)('Text', ({ tag, children, style, id }) => (
  createElement(tag, { style, id }, children)
))

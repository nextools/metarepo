import type { TColor } from '@revert/color'
import type { ReactText } from 'react'

export type TTextChildren = ReactText | ReactText[]

export type TFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type TTextStyle = {
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TFontWeight,
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  isItalic?: boolean,
  isUnderline?: boolean,
  isStrikeThrough?: boolean,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
}

export type TPrimitiveText = TTextStyle & {
  id?: string,
  children: TTextChildren,
}

import type { TColor } from '@revert/color'
import type { ReactText } from 'react'

export type TText = {
  id?: string,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
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
  children: ReactText | ReactText[],
}

import { ReactNode } from 'react'
import { TStyle } from 'stili'

export type TText = {
  id?: string,
  color?: string,
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
  children: ReactNode,
}

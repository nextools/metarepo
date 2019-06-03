import { TStyle } from 'stili'

export type TTextRoles = 'NONE'
| 'HEADING1'
| 'HEADING2'
| 'HEADING3'
| 'HEADING4'
| 'HEADING5'
| 'HEADING6'

export type TTextProps = {
  id?: string,
  color?: string,
  role?: TTextRoles,
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

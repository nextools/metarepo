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
  family?: string,
  weight?: TStyle['fontWeight'],
  size?: number,
  lineHeight?: number,
  letterSpacing?: number,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
}

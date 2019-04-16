export type TTextRoles = 'NONE'
| 'HEADING1'
| 'HEADING2'
| 'HEADING3'
| 'HEADING4'
| 'HEADING5'
| 'HEADING6'

export type TFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type TTextProps = {
  id?: string,
  color?: string,
  role?: TTextRoles,
  family?: string,
  weight?: TFontWeight,
  size?: number,
  lineHeight?: number,
  letterSpacing?: number,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
}

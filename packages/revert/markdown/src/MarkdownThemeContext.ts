import type { TColor } from '@revert/color'
import type { TFontWeight } from '@revert/text'
import { createContext } from 'react'

export type TMarkdownThemeContext = {
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TFontWeight,
  fontSize?: number,
  lineHeight?: number,

  blockquoteBorderColor?: TColor,
  blockquoteBorderWidth?: number,

  codeBackgroundColor?: TColor,
  codeColor?: TColor,
  codeFontFamily?: string,
  codeFontWeight?: TFontWeight,
  codeFontSize?: number,
  codeLineHeight?: number,

  codespanColor?: TColor,
  codespanFontFamily?: string,
  codespanFontWeight?: TFontWeight,
  codespanFontSize?: number,
  codespanLineHeight?: number,

  h1color?: TColor,
  h1fontFamily?: string,
  h1fontWeight?: TFontWeight,
  h1fontSize?: number,
  h1lineHeight?: number,

  h2color?: TColor,
  h2fontFamily?: string,
  h2fontWeight?: TFontWeight,
  h2fontSize?: number,
  h2lineHeight?: number,

  h3color?: TColor,
  h3fontFamily?: string,
  h3fontWeight?: TFontWeight,
  h3fontSize?: number,
  h3lineHeight?: number,

  hrBackgroundColor?: TColor,
  hrWidth?: number,

  strongFontWeight?: TFontWeight,

  tableBorderColor?: TColor,
  tableBorderWidth?: number,
}

export const MarkdownThemeContext = createContext<TMarkdownThemeContext>({
  blockquoteBorderColor: 0x444444ff,
  blockquoteBorderWidth: 5,

  codeBackgroundColor: 0x444444ff,

  codespanColor: 0xffee00ff,

  h1fontSize: 28,
  h1lineHeight: 32,

  h2fontSize: 22,
  h2lineHeight: 26,

  h3fontSize: 16,
  h3lineHeight: 20,

  fontSize: 16,
  lineHeight: 16,

  hrBackgroundColor: 0xff,
  hrWidth: 1,

  strongFontWeight: 700,

  tableBorderColor: 0xff,
  tableBorderWidth: 1,

})

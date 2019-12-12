import { TColor } from 'colorido'
import { TStyle } from 'stili'

export type TThemeableText = {
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  isUnderlined?: boolean,
}

export type TThemeText<InputProps> = (props: InputProps) => TThemeableText

export type TThemeableTexts<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeText<ComponentProps[key]>
}


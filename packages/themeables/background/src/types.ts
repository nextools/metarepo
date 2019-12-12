import { TColor } from 'colorido'

export type TThemeableBackground = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
}

export type TThemeBackground<InputProps> = (props: InputProps) => TThemeableBackground

export type TThemeableBackgrounds<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeBackground<ComponentProps[key]>
}

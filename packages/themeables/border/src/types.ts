import { TColor } from 'colorido'

export type TThemeableBorder = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  topWidth?: number,
  rightWidth?: number,
  bottomWidth?: number,
  leftWidth?: number,
  overflowBottom?: number,
  overflowLeft?: number,
  overflowRight?: number,
  overflowTop?: number,
}

export type TThemeBorder<InputProps> = (props: InputProps) => TThemeableBorder

export type TThemeableBorders<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeBorder<ComponentProps[key]>
}

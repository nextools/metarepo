export type TThemeableImage = {
  resizeMode?: 'contain' | 'cover',
  height?: number,
  width?: number,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
}

export type TThemeImage<InputProps> = (props: InputProps) => TThemeableImage

export type TThemeableImages<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeImage<ComponentProps[key]>
}


export type TThemeableImage = {
  resizeMode?: 'contain' | 'cover',
}

export type TThemeImage<InputProps> = (props: InputProps) => TThemeableImage

export type TThemeableImages<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeImage<ComponentProps[key]>
}



export type TThemeableSpacer = {
  blockStart?: number,
  blockEnd?: number,
  inlineStart?: number,
  inlineEnd?: number,
}

export type TThemeSpacer<InputProps> = (props: InputProps) => TThemeableSpacer

export type TThemeableSpacers<ComponentProps> = {
  [key in keyof ComponentProps]: TThemeSpacer<ComponentProps[key]>
}

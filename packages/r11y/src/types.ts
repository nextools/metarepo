export type TStringObject = {
  [k: string]: string,
}

export type TGetA11yDataOptions = {
  entryPointPath: string,
  fontsDir?: string,
}

export type TNavigationItem = {
  path: string | null,
  tag: string,
  attrs: TStringObject,
}

export type TError = {
  rule: string,
  path: string | null,
  tag: string,
  attrs: TStringObject,
}

export type TA11Data = {
  errors: TError[],
  navigationFlow: TNavigationItem[],
}

export type TWindow = Window & {
  r11y: {
    getReactName(el: Element): string | null,
    getReactPath(el: Element): string | null,
    getAttrs(el: Element): TStringObject,
  },
}


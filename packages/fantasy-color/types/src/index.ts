export type TWithAlpha = {
  alpha: number,
}

export type TRgb = {
  red: number,
  green: number,
  blue: number,
}

export type TRgba = TRgb & TWithAlpha

export type THsv = {
  hue: number,
  saturation: number,
  value: number,
}

export type THsva = THsv & TWithAlpha

export type THcl = {
  hue: number,
  chroma: number,
  luminance: number,
}

export type THcla = THcl & TWithAlpha

export type TLab = {
  luminance: number,
  a: number,
  b: number,
}

export type TLaba = TLab & TWithAlpha

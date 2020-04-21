export type TColor = number
export const rgba = (red: number, green: number, blue: number, alpha: number): TColor => ((((~~(red + 0.5)) & 0xff) << 24) | (((~~(green + 0.5)) & 0xff) << 16) | (((~~(blue + 0.5)) & 0xff) << 8) | (~~(alpha * 255 + 0.5)) & 0xff) >>> 0
export const colorToString = (color: TColor) => `rgba(${color >>> 24}, ${(color >>> 16) & 0xff}, ${(color >>> 8) & 0xff}, ${(~~((color & 0xff) / 2.55 + 0.5)) / 100})`
export const redChannel = (color: TColor) => color >>> 24
export const greenChannel = (color: TColor) => (color >>> 16) & 0xff
export const blueChannel = (color: TColor) => (color >>> 8) & 0xff
export const alphaChannel = (color: TColor) => (~~((color & 0xff) / 2.55 + 0.5)) / 100
export const isColor = (value: any): value is TColor => Number.isSafeInteger(value) && value !== Infinity && value >= 0

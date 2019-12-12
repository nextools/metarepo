export type TColor = [number, number, number, number]

export const colorToString = (color: TColor): string => `rgba(${color.join(', ')})`

export const isColor = (value: any): value is TColor => Array.isArray(value) && value.length === 4

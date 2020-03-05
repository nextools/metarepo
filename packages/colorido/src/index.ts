export type TColor = [number, number, number, number]

export const colorToString = (color: TColor): string => `rgba(${color.join(', ')})`

export const isColor = (value: any): value is TColor => {
  return Array.isArray(value) &&
         value.length === 4 &&
         value.every((item) => typeof item === 'number')
}

export type TColor = [number, number, number, number]

export const colorToString = (color: TColor): string => `rgba(${color.join(', ')})`

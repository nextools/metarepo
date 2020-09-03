import type { TColor } from '@revert/color'

export type TLinearGradient = {
  colors: [TColor, number][],
  angle?: number,
  radius?: number,
  overflow?: number,
}

export type TPrimitiveLinearGradient = TLinearGradient & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

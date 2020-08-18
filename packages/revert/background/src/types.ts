import type { TColor } from '@revert/color'

export type TBackground = {
  color: TColor,
  radius?: number,
  overflow?: number,
}

export type TPrimitiveBackground = TBackground & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

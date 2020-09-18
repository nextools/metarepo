import type { TColor } from '@revert/color'

export type TShadow = {
  color?: TColor,
  radius?: number,
  blurRadius?: number,
  spreadRadius?: number,
  offsetX?: number,
  offsetY?: number,
  overflow?: number,
}

export type TPrimitiveShadow = TShadow & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

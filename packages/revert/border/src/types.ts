import type { TColor } from '@revert/color'

export type TBorder = {
  color: TColor,
  radius?: number,
  borderWidth?: number,
  borderLeftWidth?: number,
  borderTopWidth?: number,
  borderRightWidth?: number,
  borderBottomWidth?: number,
  overflow?: number,
}

export type TPrimitiveBorder = TBorder & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

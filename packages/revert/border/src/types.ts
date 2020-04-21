import { TColor } from '@revert/color'

export type TPrimitiveBorder = TBorder & TRect

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

type TRect = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

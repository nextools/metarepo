import { TColor } from '@revert/color'

export type TPrimitiveBackground = TBackground & TRect

export type TBackground = {
  color: TColor,
  radius?: number,
  overflow?: number,
}

type TRect = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

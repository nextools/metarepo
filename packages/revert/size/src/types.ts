import { ReactElement } from 'react'

export type TSize = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  maxWidth?: number,
  maxHeight?: number,
  onWidthChange?: (width: number) => void,
  onHeightChange?: (height: number) => void,
  children: ReactElement,
}

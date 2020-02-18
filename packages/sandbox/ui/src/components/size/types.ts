import { ReactElement } from 'react'

export type TSize = {
  left?: number,
  top?: number,
  width?: number,
  maxWidth?: number,
  maxHeight?: number,
  height?: number,
  onWidthChange?: (width: number) => void,
  onHeightChange?: (height: number) => void,
  children: ReactElement,
  shouldPreventWrap?: boolean,
}

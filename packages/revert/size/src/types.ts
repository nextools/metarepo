export type TPrimitiveSize = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  maxWidth?: number,
  shouldPreventWrap?: boolean,
  onWidthChange?: (width: number) => void,
  onHeightChange?: (height: number) => void,
}

export type TSize = {
  shouldPreventWrap?: boolean,
}

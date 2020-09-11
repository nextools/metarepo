export type TSize = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  maxWidth?: number,
  maxHeight?: number,
  shouldPreventWrap?: boolean,
  onWidthChange?: (width: number) => void,
  onHeightChange?: (height: number) => void,
}

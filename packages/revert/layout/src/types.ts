import type { LAYOUT_SIZE_1, LAYOUT_SIZE_2, LAYOUT_SIZE_3, LAYOUT_SIZE_4, LAYOUT_SIZE_FIT, SYMBOL_LAYOUT_MOVE, SYMBOL_LAYOUT_MOVE_BEGIN, SYMBOL_LAYOUT_MOVE_END } from './symbols'

export type TLayoutSize = number | typeof LAYOUT_SIZE_1 | typeof LAYOUT_SIZE_2 | typeof LAYOUT_SIZE_3 | typeof LAYOUT_SIZE_4 | typeof LAYOUT_SIZE_FIT
export type TLayoutDirection = 'horizontal' | 'vertical'

export type TPointerEvent = {
  x: number,
  y: number,
}

export type TPointerDown = {
  id?: string,
  left: number,
  top: number,
  width: number,
  height: number,
  overflow?: number,
  onPointerDown: (e: TPointerEvent) => void,
  onPointerEnter: () => void,
  onPointerLeave: () => void,
}

export type TPointerMove = {
  id?: string,
  left: number,
  top: number,
  width: number,
  height: number,
  onPointerUp: (e: TPointerEvent) => void,
  onPointerMove: (e: TPointerEvent) => void,
  onPointerLeave: () => void,
}

export type TOnContentSizeChange = (value: number) => void
export type TOnItemSizeChange = (index: number, value: number) => void

export type TItemMoveState = typeof SYMBOL_LAYOUT_MOVE_BEGIN | typeof SYMBOL_LAYOUT_MOVE | typeof SYMBOL_LAYOUT_MOVE_END
export type TOnItemMove = (index: number, value: number, moveState: TItemMoveState) => void

export type TLayoutRenderState = {
  keys: string[],
  lefts: number[],
  tops: number[],
  offsets: number[],
  renderedWidths: number[],
  renderedHeights: number[],
  measuredWidths: number[],
  measuredHeights: number[],
  maxWidths: number[],
  maxHeights: number[],
  onItemWidthChangeFns: (TOnItemSizeChange | undefined)[],
  onItemHeightChangeFns: (TOnItemSizeChange | undefined)[],
  onItemMovedFns: (TOnItemMove | undefined)[],
  hasContainerWidthChanged: boolean,
  hasContainerHeightChanged: boolean,
  lastMovePos: number,
}

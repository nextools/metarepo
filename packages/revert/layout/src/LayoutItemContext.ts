import { createContext } from 'react'
import type { TLayoutDirection, TOnItemMove, TOnItemSizeChange } from './types'

export type TLayoutItemContext = {
  _direction: TLayoutDirection,
  _x: number,
  _y: number,
  _left: number,
  _top: number,
  _width: number,
  _height: number,
  _maxWidth?: number,
  _maxHeight?: number,
  _itemIndex: number,
  _onWidthChange?: TOnItemSizeChange,
  _onHeightChange?: TOnItemSizeChange,
  _onItemMove?: TOnItemMove,
}

export const LayoutItemContext = createContext<TLayoutItemContext>({
  _direction: 'horizontal',
  _x: 0,
  _y: 0,
  _left: 0,
  _top: 0,
  _width: 0,
  _height: 0,
  _itemIndex: 0,
})

LayoutItemContext.displayName = 'LayoutItemContext'

import { createContext } from 'react'

export type TLayoutItemContext = {
  _x: number,
  _y: number,
  _left: number,
  _top: number,
  _width: number,
  _height: number,
  _maxWidth?: number,
  _maxHeight?: number,
  _itemIndex: number,
  _onWidthChange?: (index: number, width: number) => void,
  _onHeightChange?: (index: number, height: number) => void,
}

export const LayoutItemContext = createContext<TLayoutItemContext>({
  _x: 0,
  _y: 0,
  _left: 0,
  _top: 0,
  _width: 0,
  _height: 0,
  _itemIndex: 0,
})

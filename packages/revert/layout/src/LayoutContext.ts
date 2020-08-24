import { createContext } from 'react'

export type TLayoutContext = {
  _x: number,
  _y: number,
  _parentLeft: number,
  _parentTop: number,
  _parentWidth: number,
  _parentHeight: number,
  _left: number,
  _top: number,
  _width: number,
  _height: number,
  _maxWidth?: number,
  _maxHeight?: number,
  _onWidthChange?: (width: number) => void,
  _onHeightChange?: (height: number) => void,
}

export const LayoutContext = createContext<TLayoutContext>({
  _x: 0,
  _y: 0,
  _parentLeft: 0,
  _parentTop: 0,
  _parentWidth: 0,
  _parentHeight: 0,
  _left: 0,
  _top: 0,
  _width: 0,
  _height: 0,
})

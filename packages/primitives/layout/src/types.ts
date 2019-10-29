import { ReactNode } from 'react'

export type TLayoutDirection = 'horizontal' | 'vertical'

export type TContextData = {
  direction: TLayoutDirection,
}

export type TVAlign = 'top' | 'center' | 'bottom'
export type THAlign = 'left' | 'center' | 'right'

export type TLayout = {
  width?: number,
  height?: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
  direction: TLayoutDirection,
  vAlign?: TVAlign,
  hAlign?: THAlign,
  children: ReactNode,
}

export type TLayoutInFlow = {
  width?: number | 'stretch' | 'equal',
  height?: number | 'stretch',
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
  children?: ReactNode,
  shouldScroll?: boolean,
  shouldIgnorePointerEvents?: boolean,
}

export type TLayoutOutOfFlow = {
  floatinIndex?: number,
  shouldScroll?: boolean,
  shouldIgnorePointerEvents?: boolean,
}

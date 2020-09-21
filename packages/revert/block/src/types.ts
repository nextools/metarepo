import type { TSize } from '@revert/size'
import type { Ref, ReactNode, CSSProperties } from 'react'

export type TPrimitiveBlock = {
  width?: number,
  height?: number,
  maxWidth?: number,
  maxHeight?: number,
  minWidth?: number,
  minHeight?: number,
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
  opacity?: number,
  floatingIndex?: number,
  tabIndex?: number,
  blendMode?: CSSProperties['mixBlendMode'],
  shouldIgnorePointerEvents?: boolean,
  shouldFlow?: boolean,
  shouldScroll?: boolean,
  shouldHideOverflow?: boolean,
  shouldForceAcceleration?: boolean,
  children?: ReactNode,
  onRef?: Ref<any>,
}

export type TBlock = {
  width?: number,
  height?: number,
  minWidth?: number,
  minHeight?: number,
  shouldIgnorePointerEvents?: boolean,
  shouldHideOverflow?: boolean,
  onRef?: Ref<any>,
}

export type TInlineBlock = Pick<TSize, 'shouldPreventWrap'>

export type TParentBlock = {
  shouldIgnorePointerEvents?: boolean,
  onRef?: Ref<any>,
}

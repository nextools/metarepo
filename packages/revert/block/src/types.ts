import { ReactNode, CSSProperties } from 'react'

export type TPrimitiveBlockCommon = {
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
}

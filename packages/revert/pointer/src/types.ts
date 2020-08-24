import type { ReactNode } from 'react'

export type TPointerEvent = {
  x: number,
  y: number,
  altKey: boolean,
  metaKey: boolean,
  ctrlKey: boolean,
  shiftKey: boolean,
}

export type TPointer = {
  isDisabled?: boolean,
  children?: ReactNode,
  onEnter?: () => void,
  onLeave?: () => void,
  onDown?: (e: TPointerEvent) => void,
  onUp?: (e: TPointerEvent) => void,
  onMove?: (e: TPointerEvent) => void,
  onWheel?: (e: TPointerEvent) => void,
}

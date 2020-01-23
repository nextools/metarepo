import { ReactNode } from 'react'

export type TIsHoveredHandlers = {
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}
export type TIsPressedHandlers = {
  onPressIn?: () => void,
  onPressOut?: () => void,
}
export type TIsFocusedHandlers = {
  onFocus?: () => void,
  onBlur?: () => void,
}

export type TRel = 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'next' | 'prev' | 'nofollow' | 'noopener' | 'noreferrer' | 'search' | 'tag'
export type TTarget = '_self' | '_blank' | '_parent' | '_top'

export type TLink = {
  id?: string,
  href?: string,
  target?: TTarget,
  tabIndex?: number,
  children?: ReactNode,
  rel?: TRel[],
  onPress?: () => void,
} & TIsHoveredHandlers
  & TIsPressedHandlers
  & TIsFocusedHandlers

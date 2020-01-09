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

export type TLink = {
  id?: string,
  href?: string,
  target?: string,
  tabIndex?: number,
  children?: ReactNode,
  rel?: string,
  onPress?: () => void,
} & TIsHoveredHandlers
  & TIsPressedHandlers
  & TIsFocusedHandlers

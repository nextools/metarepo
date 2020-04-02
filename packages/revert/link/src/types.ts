import { ReactNode } from 'react'
import { TColor } from '@revert/color'

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
  color: TColor,
  id?: string,
  href?: string,
  target?: string,
  tabIndex?: number,
  isUnderlined?: boolean,
  shouldPreventWrap?: boolean,
  shouldHideOverflow?: boolean,
  children?: ReactNode,
  onPress?: () => void,
} & TIsHoveredHandlers
  & TIsPressedHandlers
  & TIsFocusedHandlers

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

export type TButton = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  onPress?: () => void,
} & TIsHoveredHandlers & TIsPressedHandlers & TIsFocusedHandlers

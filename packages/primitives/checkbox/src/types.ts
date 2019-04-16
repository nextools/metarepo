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

export type TCheckboxProps = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  isChecked: boolean,
  onToggle: () => void,
} & TIsHoveredHandlers & TIsPressedHandlers & TIsFocusedHandlers

export type TPrimitiveCheckbox = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  isChecked: boolean,
  onToggle: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

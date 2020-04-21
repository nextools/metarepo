export type TPrimitiveCheckbox = TCheckbox & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

export type TCheckbox = {
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

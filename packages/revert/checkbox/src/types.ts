export type TCheckbox = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  isChecked: boolean,
  onToggle: (value: boolean) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

export type TPrimitiveCheckbox = TCheckbox & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

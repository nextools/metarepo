export type TButton = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  onPress?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

export type TPrimitiveButton = TButton & {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

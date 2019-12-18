export type TPrimitiveSelect = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  value: string,
  onChange: (newValue: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

export type TOption = {
  id?: string,
  isDisabled?: boolean,
  value: string,
  label: string,
}

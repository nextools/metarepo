export type TSelect = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  isHidden?: boolean,
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
}

export type TOption = {
  id?: string,
  isDisabled?: boolean,
  value: string,
  label: string,
}

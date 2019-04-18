export type TSelect = {
  id?: string,
  isDisabled?: boolean,
  isHidden?: boolean,
  color?: string,
  family?: string,
  weight?: number,
  size?: number,
  lineHeight?: number,
  letterSpacing?: number,
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

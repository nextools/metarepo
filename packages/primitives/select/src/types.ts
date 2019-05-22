import { TStyle } from 'stili'

export type TSelect = {
  id?: string,
  isDisabled?: boolean,
  isHidden?: boolean,
  family?: string,
  weight?: TStyle['fontWeight'],
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

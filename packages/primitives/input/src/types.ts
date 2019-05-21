import { TStyle } from 'stili'

export type TInput = {
  id?: string,
  isDisabled?: boolean,
  color?: string,
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
  onSubmit?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

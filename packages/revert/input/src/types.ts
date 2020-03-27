import { TStyle } from 'stili'
import { TColor } from '@revert/color'

export type TInput = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  value: string,
  onChange: (newValue: string) => void,
  onSubmit?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

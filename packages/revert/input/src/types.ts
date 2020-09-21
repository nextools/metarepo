import type { TColor } from '@revert/color'
import type { TFontWeight } from '@revert/text'

export type TInputStyle = {
  isDisabled?: boolean,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TFontWeight,
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
}

export type TInput = TInputStyle & {
  id?: string,
  accessibilityLabel?: string,
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

export type TPrimitiveInput = TInput & {
  top?: number,
  left?: number,
  width?: number,
  height?: number,
}

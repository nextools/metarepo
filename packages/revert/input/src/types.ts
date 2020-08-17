import type { TColor } from '@revert/color'

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
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
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

export type TPrimitiveInput = TInput & {
  top?: number,
  left?: number,
  width?: number,
  height?: number,
}

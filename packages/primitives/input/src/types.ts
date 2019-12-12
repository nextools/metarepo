import { TThemeableText } from '@themeables/text'

export type TInput = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
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
} & TThemeableText

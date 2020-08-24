import type { TText } from '@revert/text'

export type TLink = TText & {
  href?: string,
  target?: string,
  tabIndex?: number,
  isDisabled?: boolean,
  onPress?: () => void,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
}

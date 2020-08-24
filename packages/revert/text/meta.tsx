import { SYMBOL_CONTROL_COLOR, SYMBOL_CONTROL_DROPDOWN, SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import type { TComponentControls } from '@revert/sandbox'
import type { TComponentConfig } from 'autoprops'
import type { TText } from './src'

export const config: TComponentConfig<TText> = {
  props: {
    color: [0x23abdeff],
    fontSize: [16, 24],
    isUnderlined: [true],
    children: ['text', 'long text asdasd asdasd asdasd asds'],
  },
  required: ['children'],
}

export const controls: TComponentControls<TText> = {
  color: SYMBOL_CONTROL_COLOR,
  fontSize: SYMBOL_CONTROL_DROPDOWN,
  isUnderlined: SYMBOL_CONTROL_SWITCH,
  children: SYMBOL_CONTROL_DROPDOWN,
}

export { Text as Component } from './src'

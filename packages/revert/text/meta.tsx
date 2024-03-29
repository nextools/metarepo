import { SYMBOL_CONTROL_COLOR, SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import type { TComponentControls } from '@revert/sandbox'
import type { TComponentConfig } from 'autoprops'
import type { TPrimitiveText } from './src'

export const config: TComponentConfig<TPrimitiveText> = {
  props: {
    color: [0x23abdeff],
    fontSize: [16, 24],
    isUnderline: [true],
    children: ['text', 'long text asdasd asdasd asdasd asds'],
  },
  required: ['children'],
}

export { Text as Component } from './src'

export { default as packageJson } from './package.json'

export const controls: TComponentControls<TPrimitiveText> = {
  color: SYMBOL_CONTROL_COLOR,
  isUnderline: SYMBOL_CONTROL_SWITCH,
}

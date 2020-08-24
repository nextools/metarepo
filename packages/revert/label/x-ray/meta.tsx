import { Text } from '@revert/text'
import type { TText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TLabel } from '../src'

const TextConfig: TComponentConfig<TText> = {
  props: {
    color: [0xeeeeeeff],
    fontSize: [16],
    isUnderlined: [true],
    children: ['label text'],
  },
  required: ['children', 'color', 'fontSize', 'isUnderlined'],
}

export const config: TComponentConfig<TLabel, 'text'> = {
  props: {},
  children: {
    text: {
      Component: Text,
      config: TextConfig,
    },
  },
  required: ['text'],
}

export { PrimitiveLabel as Component } from '../src'

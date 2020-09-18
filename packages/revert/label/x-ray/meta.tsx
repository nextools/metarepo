import { Text } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TLabel } from '../src'

const TextConfig: TComponentConfig<TPrimitiveText> = {
  props: {
    color: [0xeeeeeeff],
    fontSize: [16],
    isUnderline: [true],
    children: ['label text'],
  },
  required: ['children', 'color', 'fontSize', 'isUnderline'],
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

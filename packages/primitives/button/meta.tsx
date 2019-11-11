import { TComponentConfig } from 'autoprops'
import * as TextMeta from '@primitives/text/meta'
import { TButton } from './src/types'

export const config: TComponentConfig<TButton> = {
  props: {
    isDisabled: [true],
  },
  children: {
    text: TextMeta,
  },
  required: ['text'],
}

export { Button as Component } from './src'

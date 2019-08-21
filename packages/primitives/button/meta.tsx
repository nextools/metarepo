import { TChildrenConfig, TComponentConfig } from 'autoprops'
import { Text } from '@primitives/text'
import { TButton } from './src/types'

export const childrenConfig: TChildrenConfig = {
  meta: {
    text: {
      config: {
        props: {
          children: ['Button'],
        },
        required: ['children'],
      },
      Component: Text,
    },
  },
  children: ['text'],
  required: ['text'],
}

export const config: TComponentConfig<TButton> = {
  props: {
    isDisabled: [true],
  },
}

export { Button as Component } from './src'

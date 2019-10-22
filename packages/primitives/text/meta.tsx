import { TComponentConfig } from 'autoprops'
import { TText } from './src'

export const config: TComponentConfig<TText, never> = {
  props: {
    children: ['Button'],
  },
  required: ['children'],
}

export { Text as Component } from './src'

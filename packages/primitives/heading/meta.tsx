import { TComponentConfig } from 'autoprops'
import { THeading } from './src'

export const config: TComponentConfig<THeading, never> = {
  props: {
    children: ['Heading'],
    level: [1, 2, 3, 4, 5, 6],
  },
  required: ['children'],
}

export { Heading as Component } from './src'

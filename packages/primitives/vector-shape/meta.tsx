import { TComponentConfig } from 'autoprops'
import { TVectorShape } from './src/types'

export const config: TComponentConfig<TVectorShape> = {
  props: {
    color: [
      [0xFF, 0x00, 0x00, 1],
      [0x00, 0xFF, 0x00, 1],
    ],
    path: ['M0,50 L0,50 L50,100 L100,50 L50,0 L0,50 Z'],
    height: [100],
    width: [100],
  },
  required: ['color', 'path', 'height', 'width'],
}

export { VectorShape as Component } from './src'

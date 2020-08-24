import type { TComponentConfig } from 'autoprops'
import type { TBackground } from '../src'

export const config: TComponentConfig<TBackground> = {
  props: {
    color: [0x000000ff],
    overflow: [4],
    radius: [10],
  },
}

export { Background as Component } from '../src'

import type { TComponentConfig } from 'autoprops'
import type { TBlock } from '../src'

export const config: TComponentConfig<TBlock> = {
  props: {
    width: [200],
    height: [100],
    minWidth: [100],
    minHeight: [50],
    shouldHideOverflow: [true],
    shouldIgnorePointerEvents: [true],
  },
  deps: {
    width: ['height'],
    height: ['width'],
    minWidth: ['minHeight'],
    minHeight: ['minWidth'],
  },
}

export { Block as Component } from '../src'

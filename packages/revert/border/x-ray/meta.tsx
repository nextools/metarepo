import type { TComponentConfig } from 'autoprops'
import type { TBorder } from '../src'

export const config: TComponentConfig<TBorder> = {
  props: {
    color: [0x000000ff],
    borderWidth: [2],
    borderTopWidth: [4],
    borderBottomWidth: [4],
    borderLeftWidth: [4],
    borderRightWidth: [4],
    overflow: [3],
    radius: [10],
  },
  deps: {
    borderTopWidth: ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth'],
    borderBottomWidth: ['borderTopWidth', 'borderLeftWidth', 'borderRightWidth'],
    borderLeftWidth: ['borderTopWidth', 'borderBottomWidth', 'borderRightWidth'],
    borderRightWidth: ['borderTopWidth', 'borderBottomWidth', 'borderLeftWidth'],
  },
}

export { Border as Component } from '../src'

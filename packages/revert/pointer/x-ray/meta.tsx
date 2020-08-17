import type { TComponentConfig } from 'autoprops'
import type { TPointer } from '../src'

export const config: TComponentConfig<TPointer> = {
  props: {
    isDisabled: [true],
    onDown: [() => {}],
    onUp: [() => {}],
    onEnter: [() => {}],
    onLeave: [() => {}],
    onMove: [() => {}],
    onWheel: [() => {}],
    children: ['text child'],
  },
  required: ['children'],
  deps: {
    onDown: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
    onUp: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
    onEnter: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
    onLeave: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
    onMove: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
    onWheel: ['onDown', 'onUp', 'onEnter', 'onLeave', 'onMove', 'onWheel'],
  },
}

export { Pointer as Component } from '../src'

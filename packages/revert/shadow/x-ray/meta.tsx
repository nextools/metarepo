import type { TComponentConfig } from 'autoprops'
import type { TPrimitiveShadow } from '../src'

export const config: TComponentConfig<TPrimitiveShadow> = {
  props: {
    left: [10],
    top: [10],
    width: [100],
    height: [50],
    color: [0xeeeeeeff],
    offsetX: [10],
    offsetY: [10],
    overflow: [10],
    blurRadius: [10],
    radius: [10],
    spreadRadius: [10],
  },
  deps: {
    offsetX: ['offsetY'],
    offsetY: ['offsetX'],
    radius: ['spreadRadius', 'blurRadius'],
    spreadRadius: ['radius', 'blurRadius'],
    blurRadius: ['spreadRadius', 'radius'],
    left: ['top', 'width', 'height'],
    top: ['left', 'width', 'height'],
    width: ['left', 'top', 'height'],
    height: ['left', 'top', 'width'],
  },
}

export { PrimitiveShadow as Component } from '../src'

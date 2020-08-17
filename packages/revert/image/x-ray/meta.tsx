import type { TComponentConfig } from 'autoprops'
import type { TImage } from '../src'

export const config: TComponentConfig<TImage> = {
  props: {
    source: ['http://localhost'],
    alt: ['image'],
    topRightRadius: [10],
    topLeftRadius: [10],
    bottomRightRadius: [10],
    bottomLeftRadius: [10],
    radius: [20],
    resizeMode: ['contain'],
    onError: [() => {}],
    onLoad: [() => {}],
  },
  required: ['source', 'alt'],
  deps: {
    topLeftRadius: ['topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'],
    topRightRadius: ['topLeftRadius', 'bottomLeftRadius', 'bottomRightRadius'],
    bottomLeftRadius: ['topLeftRadius', 'topRightRadius', 'bottomRightRadius'],
    bottomRightRadius: ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius'],
    onError: ['onError', 'onLoad'],
    onLoad: ['onError', 'onLoad'],
  },
}

export { Image as Component } from '../src'

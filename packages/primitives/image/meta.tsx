import { TComponentConfig } from 'autoprops'
import { TImage } from './src/types'

export const config: TComponentConfig<TImage> = {
  props: {
    source: ['data:image/gif;base64,R0lGODdhAQABAIABAAAAAP///ywAAAAAAQABAAACAkQBADs='],
    alt: ['image'],
    width: [100],
    height: [100],
    bottomLeftRadius: [20],
    bottomRightRadius: [20],
    topLeftRadius: [20],
    topRightRadius: [20],
    resizeMode: ['cover', 'contain'],
  },
  required: ['source', 'width', 'height'],
  mutin: [['bottomLeftRadius', 'bottomRightRadius', 'topLeftRadius', 'topRightRadius']],
}

export { Image as Component } from './src'

import { TComponentConfig } from 'autoprops'
import { TImage } from './src/types'

export const config: TComponentConfig<TImage> = {
  props: {
    source: ['data:image/gif;base64,R0lGODdhAQABAIABAAAAAP///ywAAAAAAQABAAACAkQBADs='],
    alt: ['pepe'],
    width: [100],
    height: [100],
    borderRadius: [20],
    resizeMode: ['cover', 'contain'],
  },
  required: ['source', 'width', 'height'],
}

export { Image as Component } from './src'

import { PrimitiveImage } from '@revert/image'
import type { TComponentImage } from 'mdown'
import type { TComponent } from 'refun'
import { SYMBOL_MARKDOWN_IMAGE } from './symbols'

export const Image: TComponent<TComponentImage> = ({ src, alt }) => (
  <PrimitiveImage source={src} alt={alt}/>
)

Image.displayName = 'MarkdownImage'
Image.componentSymbol = SYMBOL_MARKDOWN_IMAGE

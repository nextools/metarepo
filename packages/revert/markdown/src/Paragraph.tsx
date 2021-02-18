import { ImageContext } from '@revert/image'
import { Size } from '@revert/size'
import type { TComponentParagraph } from 'mdown'
import { component, mapThrottledHandlerAnimationFrame, startWithType } from 'refun'
import { mapRender } from './map-render'
import { SYMBOL_MARKDOWN_PARAGRAPH } from './symbols'

export const Paragraph = component(
  startWithType<TComponentParagraph>(),
  mapRender('onImageLoad'),
  mapThrottledHandlerAnimationFrame('onImageLoad')
)(({ onImageLoad, children }) => (
  <ImageContext.Provider value={{ onImageLoad }}>
    <Size>
      {children}
    </Size>
  </ImageContext.Provider>
))

Paragraph.displayName = 'MarkdownParagraph'
Paragraph.componentSymbol = SYMBOL_MARKDOWN_PARAGRAPH

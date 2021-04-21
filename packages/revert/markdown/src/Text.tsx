import type { TComponentText } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { SYMBOL_MARKDOWN_TEXT } from './symbols'

export const Text = component(
  startWithType<TComponentText>(),
  mapContext(MarkdownPrimitivesContext)
)(({ PrimitiveText, children }) => (
  <PrimitiveText>
    {children}
  </PrimitiveText>
))

Text.displayName = 'MarkdownText'
Text.componentSymbol = SYMBOL_MARKDOWN_TEXT

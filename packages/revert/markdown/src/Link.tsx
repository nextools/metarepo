import { PrimitiveLink } from '@revert/link'
import { TextThemeContext } from '@revert/text'
import type { TComponentLink } from 'mdown'
import { component, startWithType } from 'refun'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_LINK } from './symbols'

export const Link = component(
  startWithType<TComponentLink>(),
  mapContextOverride('TextThemeProvider', TextThemeContext, () => ({
    isUnderline: true,
  }))
)(({ url, TextThemeProvider, children }) => (
  <PrimitiveLink href={url}>
    <TextThemeProvider>
      {children}
    </TextThemeProvider>
  </PrimitiveLink>
))

Link.displayName = 'MarkdownLink'
Link.componentSymbol = SYMBOL_MARKDOWN_LINK

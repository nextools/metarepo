import { TextThemeContext } from '@revert/text'
import type { TComponentEm } from 'mdown'
import { component, startWithType } from 'refun'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_EM } from './symbols'

export const Em = component(
  startWithType<TComponentEm>(),
  mapContextOverride('TextThemeProvider', TextThemeContext, () => ({
    isItalic: true,
  }))
)(({ TextThemeProvider, children }) => (
  <TextThemeProvider>
    {children}
  </TextThemeProvider>
))

Em.displayName = 'MarkdownEm'
Em.componentSymbol = SYMBOL_MARKDOWN_EM

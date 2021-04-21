import { TextThemeContext } from '@revert/text'
import type { TComponentStrong } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_STRONG } from './symbols'

export const Strong = component(
  startWithType<TComponentStrong>(),
  mapContext(MarkdownThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ strongFontWeight }) => ({
    fontWeight: strongFontWeight,
  }))
)(({ TextThemeProvider, children }) => (
  <TextThemeProvider>
    {children}
  </TextThemeProvider>
))

Strong.displayName = 'MarkdownStrong'
Strong.componentSymbol = SYMBOL_MARKDOWN_STRONG

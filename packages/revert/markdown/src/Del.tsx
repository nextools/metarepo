import { TextThemeContext } from '@revert/text'
import type { TComponentDel } from 'mdown'
import { component, startWithType } from 'refun'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_DEL } from './symbols'

export const Del = component(
  startWithType<TComponentDel>(),
  mapContextOverride('TextThemeProvider', TextThemeContext, () => ({
    isStrikeThrough: true,
  }))
)(({ TextThemeProvider, children }) => (
  <TextThemeProvider>
    {children}
  </TextThemeProvider>
))

Del.displayName = 'MarkdownDel'
Del.componentSymbol = SYMBOL_MARKDOWN_DEL

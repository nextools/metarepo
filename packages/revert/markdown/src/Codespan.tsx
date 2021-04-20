import { TextThemeContext } from '@revert/text'
import type { TComponentCodespan } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { Text } from './Text'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_STRONG } from './symbols'

export const Codespan = component(
  startWithType<TComponentCodespan>(),
  mapContext(MarkdownThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, (props) => ({
    color: props.codespanColor,
    fontFamily: props.codespanFontFamily,
    fontSize: props.codespanFontSize,
    fontWeight: props.codespanFontWeight,
    lineHeight: props.codespanLineHeight,
  }))
)(({ TextThemeProvider, children }) => (
  <TextThemeProvider>
    <Text>
      {children}
    </Text>
  </TextThemeProvider>
))

Codespan.displayName = 'MarkdownCodespan'
Codespan.componentSymbol = SYMBOL_MARKDOWN_STRONG

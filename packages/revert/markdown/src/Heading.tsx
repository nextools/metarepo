import { TextThemeContext } from '@revert/text'
import type { TComponentHeading } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { Paragraph } from './Paragraph'
import { mapContextOverride } from './map-context-override'
import { SYMBOL_MARKDOWN_HEADING } from './symbols'

export const Heading = component(
  startWithType<TComponentHeading>(),
  mapContext(MarkdownThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, (props) => {
    switch (props.depth) {
      case 1:
        return {
          color: props.h1color,
          fontFamily: props.h1fontFamily,
          fontSize: props.h1fontSize,
          fontWeight: props.h1fontWeight,
          lineHeight: props.h1lineHeight,
        }
      case 2:
        return {
          color: props.h2color,
          fontFamily: props.h2fontFamily,
          fontSize: props.h2fontSize,
          fontWeight: props.h2fontWeight,
          lineHeight: props.h2lineHeight,
        }
      case 3:
        return {
          color: props.h3color,
          fontFamily: props.h3fontFamily,
          fontSize: props.h3fontSize,
          fontWeight: props.h3fontWeight,
          lineHeight: props.h3lineHeight,
        }
      default:
        return {
          color: props.color,
          fontFamily: props.fontFamily,
          fontSize: props.fontSize,
          fontWeight: props.fontWeight,
          lineHeight: props.lineHeight,
        }
    }
  })
)(({ TextThemeProvider, children }) => (
  <TextThemeProvider>
    {Paragraph({ children })}
  </TextThemeProvider>
))

Heading.displayName = 'MarkdownHeading'
Heading.componentSymbol = SYMBOL_MARKDOWN_HEADING

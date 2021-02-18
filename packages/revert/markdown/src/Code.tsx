import { Layout, Layout_Item } from '@revert/layout'
import type { TComponentCode } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { SYMBOL_MARKDOWN_CODE } from './symbols'

export const Code = component(
  startWithType<TComponentCode>(),
  mapContext(MarkdownPrimitivesContext),
  mapContext(MarkdownThemeContext)
)(({
  LayoutBackground,
  LayoutText,
  codeBackgroundColor,
  codeColor,
  codeFontFamily,
  codeFontSize,
  codeFontWeight,
  codeLineHeight,
  children,
}) => (
  <Layout hPadding={5} vPadding={5}>
    <LayoutBackground color={codeBackgroundColor}/>
    <Layout_Item>
      <LayoutText
        color={codeColor}
        fontFamily={codeFontFamily}
        fontSize={codeFontSize}
        fontWeight={codeFontWeight}
        lineHeight={codeLineHeight}
        shouldPreserveWhitespace
      >
        {children}
      </LayoutText>
    </Layout_Item>
  </Layout>
))

Code.displayName = 'MarkdownCode'
Code.componentSymbol = SYMBOL_MARKDOWN_CODE

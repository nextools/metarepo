import { Block } from '@revert/block'
import type { TComponentHr } from 'mdown'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { SYMBOL_MARKDOWN_HR } from './symbols'

export const Hr = component(
  startWithType<TComponentHr>(),
  mapContext(MarkdownPrimitivesContext),
  mapContext(MarkdownThemeContext)
)(({ LayoutBackground, hrBorderColor, hrWidth }) => (
  <Block height={hrWidth}>
    <LayoutBackground color={hrBorderColor}/>
  </Block>
))

Hr.displayName = 'MarkdownHr'
Hr.componentSymbol = SYMBOL_MARKDOWN_HR

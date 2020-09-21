import { Layout, Layout_Item, Layout_Spacer } from '@revert/layout'
import type { TComponentBlockquote } from 'mdown'
import React, { Children } from 'react'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { SYMBOL_MARKDOWN_BLOCKQUOTE } from './symbols'

export const Blockquote = component(
  startWithType<TComponentBlockquote>(),
  mapContext(MarkdownPrimitivesContext),
  mapContext(MarkdownThemeContext)
)(({ Border, blockquoteBorderColor, blockquoteBorderWidth, children }) => (
  <Layout>
    <Border color={blockquoteBorderColor} borderLeftWidth={blockquoteBorderWidth}/>
    <Layout_Spacer width={20}/>
    <Layout_Item>
      <Layout direction="vertical" vPadding={5} spaceBetween={10}>
        {Children.map(children, (child) => (
          <Layout_Item>
            {child}
          </Layout_Item>
        ))}
      </Layout>
    </Layout_Item>
  </Layout>
))

Blockquote.displayName = 'MarkdownBlockquote'
Blockquote.componentSymbol = SYMBOL_MARKDOWN_BLOCKQUOTE

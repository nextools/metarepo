import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import type { TComponentList } from 'mdown'
import { Children } from 'react'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { SYMBOL_MARKDOWN_LIST } from './symbols'

const itemPrefixes = ['•', '▪', '▫︎']

export const List = component(
  startWithType<TComponentList>(),
  mapContext(MarkdownPrimitivesContext)
)(({ LayoutText, children, depth }) => (
  <Layout direction="vertical">
    {Children.map(children, (child) => (
      <Layout_Item>
        <Layout spaceBetween={5}>
          <Layout_Item width={LAYOUT_SIZE_FIT}>
            <LayoutText>{itemPrefixes[depth % itemPrefixes.length]}</LayoutText>
          </Layout_Item>
          <Layout_Item>
            {child}
          </Layout_Item>
        </Layout>
      </Layout_Item>
    ))}
  </Layout>
))

List.displayName = 'MarkdownList'
List.componentSymbol = SYMBOL_MARKDOWN_LIST

import { Layout, Layout_Item } from '@revert/layout'
import type { TComponentListItem } from 'mdown'
import React from 'react'
import { component, startWithType } from 'refun'
import { Paragraph } from './Paragraph'
import { mapChildren, SYMBOL_CHILDREN_REST } from './map-children'
import { SYMBOL_MARKDOWN_LIST, SYMBOL_MARKDOWN_LIST_ITEM } from './symbols'

export const ListItem = component(
  startWithType<TComponentListItem>(),
  mapChildren({
    list: {
      symbols: [SYMBOL_MARKDOWN_LIST],
    },
    restChildren: {
      symbols: [SYMBOL_CHILDREN_REST],
      isMultiple: true,
    },
  })
)(({ list, restChildren }) => {
  return (
    <Layout direction="vertical">
      <Layout_Item>
        <Paragraph>
          {restChildren}
        </Paragraph>
      </Layout_Item>
      {list.length > 0 && (
        <Layout_Item>
          {list}
        </Layout_Item>
      )}
    </Layout>
  )
})

ListItem.displayName = 'MarkdownListItem'
ListItem.componentSymbol = SYMBOL_MARKDOWN_LIST_ITEM

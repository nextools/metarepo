import { Layout, Layout_Item } from '@revert/layout'
import type { TComponentListItem } from 'mdown'
import type { ReactNode, ReactElement } from 'react'
import { isValidElement, Children } from 'react'
import type { TComponent } from 'refun'
import { isFunction } from 'tsfn'
import { Paragraph } from './Paragraph'
import { SYMBOL_MARKDOWN_CODE, SYMBOL_MARKDOWN_LIST, SYMBOL_MARKDOWN_LIST_ITEM } from './symbols'

export const ListItem: TComponent<TComponentListItem> = ({ children }) => {
  const result: ReactElement[] = []
  let paragraph: ReactNode[] = []
  let key = 0

  Children.forEach(children, (child) => {
    if (isValidElement(child) && isFunction(child.type)) {
      const componentSymbol = (child.type as TComponent<{}>).componentSymbol

      // Check if the next element is "Block" type
      if (componentSymbol === SYMBOL_MARKDOWN_LIST || componentSymbol === SYMBOL_MARKDOWN_CODE) {
        // Before adding the "Block" - flush accumulated "Inline" elements
        if (paragraph.length > 0) {
          result.push(
            <Layout_Item key={key++}>
              <Paragraph>
                {paragraph}
              </Paragraph>
            </Layout_Item>
          )

          paragraph = []
        }

        // Add "Block" element
        result.push(
          <Layout_Item key={key++}>
            {child}
          </Layout_Item>
        )

        return
      }
    }

    // Next element is "Inline" type
    paragraph.push(child)
  })

  return (
    <Layout direction="vertical">
      {result}
      {paragraph.length > 0 && (
        <Layout_Item key={key++}>
          <Paragraph>
            {paragraph}
          </Paragraph>
        </Layout_Item>
      )}
    </Layout>
  )
}

ListItem.displayName = 'MarkdownListItem'
ListItem.componentSymbol = SYMBOL_MARKDOWN_LIST_ITEM

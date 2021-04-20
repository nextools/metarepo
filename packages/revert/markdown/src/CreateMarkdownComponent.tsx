import type { TPrimitiveBackground } from '@revert/background'
import type { TPrimitiveBorder } from '@revert/border'
import { Layout, Layout_Item } from '@revert/layout'
import type { TPrimitiveText } from '@revert/text'
import type { TMarkdownToReactConfig } from 'mdown'
import { markdownToReact } from 'mdown'
import type { FC } from 'react'
import { Children } from 'react'
import { mapWithPropsMemo, pureComponent, startWithType } from 'refun'
import { Blockquote } from './Blockquote'
import { Code } from './Code'
import { Codespan } from './Codespan'
import { Del } from './Del'
import { Em } from './Em'
import { Heading } from './Heading'
import { Hr } from './Hr'
import { Image } from './Image'
import { Link } from './Link'
import { List } from './List'
import { ListItem } from './ListItem'
import { MarkdownPrimitivesProvider } from './MarkdownPrimitivesProvider'
import { Paragraph } from './Paragraph'
import { Strong } from './Strong'
import { Table, TableCell, TableHeaderCell, TableRow } from './Table'
import { Text } from './Text'
import { SYMBOL_MARKDOWN } from './symbols'

const config: TMarkdownToReactConfig = {
  blockquote: Blockquote,
  code: Code,
  codespan: Codespan,
  del: Del,
  em: Em,
  heading: Heading,
  hr: Hr,
  image: Image,
  link: Link,
  list: List,
  listItem: ListItem,
  paragraph: Paragraph,
  strong: Strong,
  table: Table,
  tableCell: TableCell,
  tableHeaderCell: TableHeaderCell,
  tableRow: TableRow,
  text: Text,
}

export type TCreateMarkdownComponent = {
  PrimitiveText?: FC<TPrimitiveText>,
  PrimitiveBackground?: FC<TPrimitiveBackground>,
  PrimitiveBorder?: FC<TPrimitiveBorder>,
}

export type TMarkdown = {
  source: string,
}

export const CreateMarkdownComponent = ({
  PrimitiveBackground,
  PrimitiveBorder,
  PrimitiveText,
}: TCreateMarkdownComponent = {}) => {
  const Markdown = pureComponent(
    startWithType<TMarkdown>(),
    mapWithPropsMemo(({ source }) => ({
      children: markdownToReact(source, config),
    }), ['source'])
  )(({ children }) => (
    <MarkdownPrimitivesProvider
      PrimitiveBackground={PrimitiveBackground}
      PrimitiveBorder={PrimitiveBorder}
      PrimitiveText={PrimitiveText}
    >
      <Layout direction="vertical" hPadding={14} vPadding={10} spaceBetween={10}>
        {Children.map(children, (child) => (
          <Layout_Item>
            {child}
          </Layout_Item>
        ))}
      </Layout>
    </MarkdownPrimitivesProvider>
  ))

  Markdown.displayName = 'Markdown'
  Markdown.componentSymbol = SYMBOL_MARKDOWN

  return Markdown
}

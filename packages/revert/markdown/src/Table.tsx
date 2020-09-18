import { Layout, Layout_Item } from '@revert/layout'
import { TextAlign } from '@revert/text-align'
import type { TComponentTable, TComponentTableCell, TComponentTableHeaderCell, TComponentTableRow } from 'mdown'
import React, { Children, Fragment } from 'react'
import { component, mapContext, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'
import { MarkdownThemeContext } from './MarkdownThemeContext'
import { Paragraph } from './Paragraph'
import { mapChildren } from './map-children'
import {
  SYMBOL_MARKDOWN_TABLE,
  SYMBOL_MARKDOWN_TABLE_CELL,
  SYMBOL_MARKDOWN_TABLE_HEADER_CELL,
  SYMBOL_MARKDOWN_TABLE_ROW,
} from './symbols'

export const Table = component(
  startWithType<TComponentTable>(),
  mapContext(MarkdownPrimitivesContext),
  mapContext(MarkdownThemeContext)
)(({
  Background,
  tableBorderColor,
  tableBorderWidth,
  children,
}) => (
  <Layout direction="vertical">
    <Layout_Item height={tableBorderWidth}>
      <Background color={tableBorderColor}/>
    </Layout_Item>
    {Children.map(children, (child, i) => (
      <Fragment>
        {i > 0 && (
          <Layout_Item height={tableBorderWidth}>
            <Background color={tableBorderColor}/>
          </Layout_Item>
        )}
        <Layout_Item>
          {child}
        </Layout_Item>
      </Fragment>
    ))}
    <Layout_Item height={tableBorderWidth}>
      <Background color={tableBorderColor}/>
    </Layout_Item>
  </Layout>
))

Table.displayName = 'MarkdownTable'
Table.componentSymbol = SYMBOL_MARKDOWN_TABLE

export const TableRow = component(
  startWithType<TComponentTableRow>(),
  mapChildren({
    cells: {
      symbols: [SYMBOL_MARKDOWN_TABLE_CELL, SYMBOL_MARKDOWN_TABLE_HEADER_CELL],
      isMultiple: true,
    },
  }),
  mapContext(MarkdownPrimitivesContext),
  mapContext(MarkdownThemeContext)
)(({
  Background,
  tableBorderColor,
  tableBorderWidth,
  cells,
}) => (
  <Layout>
    <Layout_Item width={tableBorderWidth}>
      <Background color={tableBorderColor}/>
    </Layout_Item>
    {cells.map((cell, i) => (
      <Fragment key={i}>
        {i > 0 && (
          <Layout_Item width={tableBorderWidth}>
            <Background color={tableBorderColor}/>
          </Layout_Item>
        )}
        <Layout_Item>
          {cell}
        </Layout_Item>
      </Fragment>
    ))}
    <Layout_Item width={tableBorderWidth}>
      <Background color={tableBorderColor}/>
    </Layout_Item>
  </Layout>
))

TableRow.displayName = 'MarkdownTableRow'
TableRow.componentSymbol = SYMBOL_MARKDOWN_TABLE_ROW

export const TableCell = component(
  startWithType<TComponentTableCell>()
)(({ align, children }) => (
  <Paragraph>
    <TextAlign align={align}>
      {children}
    </TextAlign>
  </Paragraph>
))

TableCell.displayName = 'MarkdownTableCell'
TableCell.componentSymbol = SYMBOL_MARKDOWN_TABLE_CELL

export const TableHeaderCell = component(
  startWithType<TComponentTableHeaderCell>()
)(({ align, children }) => (
  <Paragraph>
    <TextAlign align={align}>
      {children}
    </TextAlign>
  </Paragraph>
))

TableHeaderCell.displayName = 'MarkdownTableHeaderCell'
TableHeaderCell.componentSymbol = SYMBOL_MARKDOWN_TABLE_HEADER_CELL
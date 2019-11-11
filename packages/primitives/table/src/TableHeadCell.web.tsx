import React, { ReactNode } from 'react'
import { normalizeStyle } from 'stili'
import { startWithType, component, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { TTableBorderStyle, TTableCellPosition } from './types'

export type TTableHeadCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
  width?: number,
} & TTableBorderStyle
  & TTableCellPosition

export const TableHeadCell = component(
  startWithType<TTableHeadCell>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithPropsMemo(({
    borderTopWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderRightWidth,
    borderStyle,
    borderColor,
    backgroundColor,
    width,
    position,
  }) => ({
    style: normalizeStyle({
      padding: 0,
      borderColor,
      backgroundColor,
      borderTopWidth: `${borderTopWidth}px`,
      borderBottomWidth: `${borderBottomWidth}px`,
      borderLeftWidth: `${borderLeftWidth}px`,
      borderRightWidth: `${borderRightWidth}px`,
      borderStyle,
      width,
      position,
    }),
  }), [
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderStyle',
    'borderColor',
    'backgroundColor',
    'width',
    'position',
  ])
)(({ id, style, children }) => (
  <th id={id} style={style}>
    {children}
  </th>
))

TableHeadCell.displayName = 'TableHeadCell'

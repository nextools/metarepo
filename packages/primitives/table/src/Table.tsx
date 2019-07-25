import React, { ReactNode } from 'react'
import { startWithType, component, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { normalizeStyle } from 'stili'
import { TTableBorderStyle } from './types'

export type TTable = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
} & TTableBorderStyle

export const Table = component(
  startWithType<TTable>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithPropsMemo(({ borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderStyle, borderColor, backgroundColor }) => ({
    style: normalizeStyle({
      borderCollapse: 'collapse',
      flexGrow: 1,
      flexShrink: 1,
      alignSelf: 'stretch',
      maxWidth: '100%',
      minWidth: 0,
      padding: 0,
      borderColor,
      backgroundColor,
      borderTopWidth: `${borderTopWidth}px`,
      borderBottomWidth: `${borderBottomWidth}px`,
      borderLeftWidth: `${borderLeftWidth}px`,
      borderRightWidth: `${borderRightWidth}px`,
      borderStyle,
    }),
  }), ['borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'borderStyle', 'borderColor', 'backgroundColor'])
)(({ id, children, style }) => (
  <table id={id} style={style}>
    {children}
  </table>
))

Table.displayName = 'Table'

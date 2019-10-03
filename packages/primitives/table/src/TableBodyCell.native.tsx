import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { startWithType, component, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { TTableBorderStyle } from './types'

export type TTableBodyCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
} & TTableBorderStyle

export const TableBodyCell = component(
  startWithType<TTableBodyCell>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithPropsMemo(({ borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderStyle, borderColor, backgroundColor }) => ({
    style: {
      padding: 0,
      borderColor,
      backgroundColor,
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
      borderStyle,
    },
  }), ['borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'borderStyle', 'borderColor', 'backgroundColor'])
)(({ id, style, children }) => (
  <View testID={id} style={style}>
    {children}
  </View>
))

TableBodyCell.displayName = 'TableBodyCell'

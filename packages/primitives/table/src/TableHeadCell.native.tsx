import React, { ReactNode } from 'react'
import { startWithType, component, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { View } from 'react-native'
import { TTableBorderStyle } from './types'

export type TTableHeadCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
  width?: number,
} & TTableBorderStyle

export const TableHeadCell = component(
  startWithType<TTableHeadCell>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithPropsMemo(({ borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderStyle, borderColor, backgroundColor, width }) => ({
    style: {
      padding: 0,
      borderColor,
      backgroundColor,
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
      borderStyle,
      width,
    },
  }), ['borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'borderStyle', 'borderColor', 'backgroundColor', 'width'])
)(({ id, style, children }) => (
  <View testID={id} style={style}>
    {children}
  </View>
))

TableHeadCell.displayName = 'TableHeadCell'

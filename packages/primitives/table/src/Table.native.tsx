import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { startWithType, component, mapWithPropsMemo, mapDefaultProps } from 'refun'
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
    style: {
      flexGrow: 1,
      flexShrink: 1,
      width: '100%',
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
)(({ id, children, style }) => (
  <View testID={id} style={style}>
    {children}
  </View>
))

Table.displayName = 'Table'

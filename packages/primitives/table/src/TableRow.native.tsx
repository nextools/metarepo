import React, { ReactNode, FC } from 'react'
import { View } from 'react-native'

export type TTableRow = {
  id?: string,
  children?: ReactNode,
}

export const TableRow: FC<TTableRow> = (({ id, children }) => (
  <View testID={id} style={{ flexDirection: 'row' }}>
    {children}
  </View>
))

TableRow.displayName = 'TableRow'

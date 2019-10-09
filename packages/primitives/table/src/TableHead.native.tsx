import React, { ReactNode, FC } from 'react'
import { View } from 'react-native'

export type TTableHead = {
  id?: string,
  children?: ReactNode,
}

export const TableHead: FC<TTableHead> = (({ id, children }) => (
  <View testID={id}>
    {children}
  </View>
))

TableHead.displayName = 'TableHead'

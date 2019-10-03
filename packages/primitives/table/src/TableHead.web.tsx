import React, { ReactNode, FC } from 'react'

export type TTableHead = {
  id?: string,
  children?: ReactNode,
}

export const TableHead: FC<TTableHead> = (({ id, children }) => (
  <thead id={id}>
    {children}
  </thead>
))

TableHead.displayName = 'TableHead'

import React, { ReactNode, FC } from 'react'

export type TTableRow = {
  id?: string,
  children?: ReactNode,
}

export const TableRow: FC<TTableRow> = (({ id, children }) => (
  <tr id={id}>
    {children}
  </tr>
))

TableRow.displayName = 'TableRow'

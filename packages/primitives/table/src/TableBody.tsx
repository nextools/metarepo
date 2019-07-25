import React, { ReactNode, FC } from 'react'

export type TTableBody = {
  id?: string,
  children?: ReactNode,
}

export const TableBody: FC<TTableBody> = ({ id, children }) => (
  <tbody id={id}>
    {children}
  </tbody>
)

TableBody.displayName = 'TableBody'

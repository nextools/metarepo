import React from 'react'
import type { FC } from 'react'
import { ImportPackageNameContext } from './ImportPackageNameContext'

export type TImportPackageNameProvider = {
  getImportPackageName?: (symbolName: string) => string,
}

export const ImportPackageNameProvider: FC<TImportPackageNameProvider> = ({ getImportPackageName, children }) => (
  <ImportPackageNameContext.Provider value={{ getImportPackageName }}>
    {children}
  </ImportPackageNameContext.Provider>
)

import { createContext } from 'react'

export type TImportPackageNameContext = {
  getImportPackageName?: (symbolName: string) => string,
}

export const ImportPackageNameContext = createContext<TImportPackageNameContext>({})

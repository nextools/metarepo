import type { FC } from 'react'
import { serializeComponent, TYPE_COMPONENT_NAME, TYPE_VALUE_SYMBOL } from 'syntx'

export const serializeImportsToText = (Component: FC<any>, props: any, getImportPackageName: (smb: string) => string) => {
  const allSymbols = new Set<string>()

  for (const line of serializeComponent(Component, props, { indent: 2 })) {
    for (const { type, value } of line.elements) {
      if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
        allSymbols.add(value)
      }
    }
  }

  const symbolsByPackage = new Map<string, string[]>()

  for (const smb of allSymbols) {
    const pkgName = getImportPackageName(smb)

    if (symbolsByPackage.has(pkgName)) {
      symbolsByPackage.get(pkgName)!.push(smb)
    } else {
      symbolsByPackage.set(pkgName, [smb])
    }
  }

  let importsStr = ''

  for (const [pkgName, symbolsNames] of symbolsByPackage) {
    if (symbolsNames.length === 1) {
      importsStr += `import { ${symbolsNames[0]} } from '${pkgName}'\n`
    } else {
      importsStr += `import {\n  ${symbolsNames.sort().join(',\n  ')}\n} from '${pkgName}'\n`
    }
  }

  return importsStr
}

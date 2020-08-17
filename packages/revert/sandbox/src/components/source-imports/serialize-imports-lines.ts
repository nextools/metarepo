import type { FC } from 'react'
import {
  serializeComponent,
  TYPE_COMPONENT_NAME,
  TYPE_VALUE_SYMBOL,
  TYPE_WHITESPACE,
  TYPE_OBJECT_BRACE,
  TYPE_OBJECT_COMMA,
  TYPE_QUOTE,
  TYPE_VALUE_STRING,
} from 'syntx'
import type { TLine, TLineElement } from 'syntx'

export const serializeImportsLines = (Component: FC<any>, props: any, getImportPackageNameForSymbol: (smb: string) => string): TLine[] => {
  const allSymbolsNames = new Set<string>()

  for (const line of serializeComponent(Component, props, { indent: 2 })) {
    for (const { type, value } of line.elements) {
      if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
        allSymbolsNames.add(value)
      }
    }
  }

  const symbolsByPackage = new Map<string, string[]>()

  for (const symbolName of allSymbolsNames) {
    const pkgName = getImportPackageNameForSymbol(symbolName)

    if (symbolsByPackage.has(pkgName)) {
      symbolsByPackage.get(pkgName)!.push(symbolName)
    } else {
      symbolsByPackage.set(pkgName, [symbolName])
    }
  }

  const importsLines: TLineElement[][] = []

  for (const [pkgName, symbolNames] of symbolsByPackage) {
    if (symbolNames.length === 1) {
      importsLines.push([
        {
          type: TYPE_WHITESPACE,
          value: 'import ',
        },
        {
          type: TYPE_OBJECT_BRACE,
          value: '{ ',
        },
        {
          type: TYPE_COMPONENT_NAME,
          value: symbolNames[0],
        },
        {
          type: TYPE_OBJECT_BRACE,
          value: ' }',
        },
        {
          type: TYPE_WHITESPACE,
          value: ' from ',
        },
        {
          type: TYPE_QUOTE,
          value: '\'',
        },
        {
          type: TYPE_VALUE_STRING,
          value: pkgName,
        },
        {
          type: TYPE_QUOTE,
          value: '\'',
        },
      ])
    } else {
      importsLines.push([
        {
          type: TYPE_WHITESPACE,
          value: 'import ',
        },
        {
          type: TYPE_OBJECT_BRACE,
          value: '{',
        },
      ])

      for (const smb of symbolNames.sort()) {
        importsLines.push([
          {
            type: TYPE_WHITESPACE,
            value: '  ',
          },
          {
            type: TYPE_COMPONENT_NAME,
            value: smb,
          },
          {
            type: TYPE_OBJECT_COMMA,
            value: ',',
          },
        ])
      }

      importsLines.push([
        {
          type: TYPE_OBJECT_BRACE,
          value: '}',
        },
        {
          type: TYPE_WHITESPACE,
          value: ' from ',
        },
        {
          type: TYPE_QUOTE,
          value: '\'',
        },
        {
          type: TYPE_VALUE_STRING,
          value: pkgName,
        },
        {
          type: TYPE_QUOTE,
          value: '\'',
        },
      ])
    }
  }

  return importsLines.map((line) => ({
    elements: line,
  }))
}

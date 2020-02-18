import { FC } from 'react'
import { serializeComponent, TYPE_COMPONENT_NAME, TYPE_VALUE_SYMBOL, TLineElement, TYPE_WHITESPACE, TYPE_OBJECT_BRACE, TYPE_OBJECT_COMMA, TYPE_QUOTE, TYPE_VALUE_STRING, TLine } from 'syntx'

export const serializeImportsLines = (Component: FC<any>, props: any, importPackageName: string): TLine[] => {
  const imports = new Set<string>()

  serializeComponent(Component, props, { indent: 2 })
    .forEach((line) => {
      line.elements.forEach(({ type, value }) => {
        if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
          imports.add(value)
        }
      })
    })

  const importsLines: TLineElement[][] = [[
    {
      type: TYPE_WHITESPACE,
      value: 'import ',
    },
    {
      type: TYPE_OBJECT_BRACE,
      value: '{',
    },
  ]]

  Array.from(imports)
    .sort()
    .forEach((lineStr) => {
      importsLines.push([
        {
          type: TYPE_WHITESPACE,
          value: '  ',
        },
        {
          type: TYPE_COMPONENT_NAME,
          value: lineStr,
        },
        {
          type: TYPE_OBJECT_COMMA,
          value: ',',
        },
      ])
    })

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
      value: importPackageName,
    },
    {
      type: TYPE_QUOTE,
      value: '\'',
    },
  ])

  return importsLines.map((line) => ({
    elements: line,
  }))
}

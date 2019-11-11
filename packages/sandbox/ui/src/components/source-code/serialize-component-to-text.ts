import { FC } from 'react'
import { serializeComponent, TYPE_COMPONENT_NAME, TYPE_VALUE_SYMBOL } from 'syntx'
import { isString } from 'tsfn'

export const serializeComponentToText = (Component: FC<any>, props: any, importPackageName?: string) => {
  const imports = new Set<string>()

  const sourceString = serializeComponent(Component, props, { indent: 2 })
    .reduce((result, line) => {
      const lineString = line.elements.reduce((lineResult, { type, value }) => {
        if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
          imports.add(value)
        }

        return lineResult + value
      }, '')

      return `${result}${lineString}\n`
    }, '')

  let importsStr = ''

  if (isString(importPackageName)) {
    importsStr += 'import {\n  '
    importsStr += Array.from(imports)
      .sort()
      .join(',\n  ')
    importsStr += `\n} from '${importPackageName}'\n\n`
  }

  return importsStr + sourceString
}

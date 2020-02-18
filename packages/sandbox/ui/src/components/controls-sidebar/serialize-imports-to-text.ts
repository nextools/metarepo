import { FC } from 'react'
import { serializeComponent, TYPE_COMPONENT_NAME, TYPE_VALUE_SYMBOL } from 'syntx'

export const serializeImportsToText = (Component: FC<any>, props: any, importPackageName: string) => {
  const imports = new Set<string>()

  serializeComponent(Component, props, { indent: 2 })
    .forEach((line) => {
      line.elements.forEach(({ type, value }) => {
        if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
          imports.add(value)
        }
      })
    })

  let importsStr = 'import {\n  '

  importsStr += Array.from(imports)
    .sort()
    .join(',\n  ')
  importsStr += `\n} from '${importPackageName}'\n\n`

  return importsStr
}

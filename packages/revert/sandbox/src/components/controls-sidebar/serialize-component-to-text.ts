import type { FC } from 'react'
import { serializeComponent } from 'syntx'

export const serializeComponentToText = (Component: FC<any>, props: any) => {
  return serializeComponent(Component, props, { indent: 2 })
    .reduce((result, line) => {
      const lineString = line.elements.reduce((lineResult, { value }) => lineResult + value, '')

      return `${result}${lineString}\n`
    }, '')
}

import { ComponentClass, FC } from 'react'
import { TConfig } from './types'
import { serializeComponent } from './serialize-component'

export * from './types'

export const highlighter = (Component: ComponentClass<any> | FC<any>, props: any, config: TConfig) => {
  const { components: { Root } } = config
  const { body } = serializeComponent(Component, props, config)

  return Root(body)
}

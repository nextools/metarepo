import { mapPropsIterable } from 'autoprops'
import { serializeComponent } from 'syntx'
import { Component, config } from './meta'

export const examples = mapPropsIterable(config, ({ id, props }) => ({
  id,
  element: (
    <Component {...props}/>
  ),
  meta: () => serializeComponent(Component, props, { indent: 2 }).map((line) => line.elements),
}))

export const name = Component.displayName

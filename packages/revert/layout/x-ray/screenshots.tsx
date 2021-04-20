import { mapPropsIterable } from 'autoprops'
import { serializeComponent } from 'syntx'
import { LayoutContext } from '../src'
import { Component, config } from './meta'

export const examples = mapPropsIterable(config, ({ id, props }) => ({
  id,
  options: {
    hasOwnWidth: false,
    maxWidth: 200,
  },
  element: (
    <LayoutContext.Provider
      value={{
        _x: 0,
        _y: 0,
        _left: 0,
        _top: 0,
        _width: 200,
        _height: 200,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: 200,
        _parentHeight: 200,
      }}
    >
      <Component {...props}/>
    </LayoutContext.Provider>
  ),
  meta: () => serializeComponent(Component, props, { indent: 2 }).map((line) => line.elements),
}))

export const name = Component.displayName

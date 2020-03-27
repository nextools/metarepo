import React from 'react'
import {
  component,
  mapState,
  startWithType,
  onMountUnmount,
} from 'refun'
import { LayoutContext } from '@revert/layout'
import { RootContext } from './RootContext'
import { getDimensions, subscribeDimensions } from './dimensions'

export const Root = component(
  startWithType<{}>(),
  mapState('dimensions', 'setDimensions', () => getDimensions(), []),
  onMountUnmount(({ setDimensions }) => subscribeDimensions(setDimensions))
)(({ children, dimensions }) => (
  <RootContext.Provider
    value={{
      _rootWidth: dimensions.width,
      _rootHeight: dimensions.height,
    }}
  >
    <LayoutContext.Provider
      value={{
        _x: 0,
        _y: 0,
        _left: 0,
        _top: 0,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: dimensions.width,
        _parentHeight: dimensions.height,
        _width: dimensions.width,
        _height: dimensions.height,
        _maxWidth: dimensions.width,
        _maxHeight: dimensions.height,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </RootContext.Provider>
))

Root.displayName = 'Root'
Root.componentSymbol = Symbol('REVERT_ROOT')

import { LayoutContext } from '@revert/layout'
import {
  component,
  mapState,
  startWithType,
  onUpdate,
} from 'refun'
import { RootContext } from './RootContext'
import { getDimensions, subscribeDimensions } from './dimensions'
import type { TRoot } from './types'

export const Root = component(
  startWithType<TRoot>(),
  mapState('dimensions', 'setDimensions', getDimensions, []),
  onUpdate(({ setDimensions }) => subscribeDimensions(setDimensions), [])
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

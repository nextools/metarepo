import React from 'react'
import {
  component,
  mapState,
  onMount,
  onUnmount,
  startWithType,
  mapHandlers,
  mapThrottledHandlerAnimationFrame,
} from 'refun'
import { globalObject } from '../../utils'
import { LayoutContext } from '../layout-context'
import { RootContext } from './RootContext'

export const Root = component(
  startWithType<{}>(),
  mapState('dimensions', 'setDimensions', () => ({
    width: globalObject.innerWidth,
    height: globalObject.innerHeight,
  }), []),
  mapHandlers({
    setDimensions: ({ setDimensions }) => () => setDimensions({
      width: globalObject.innerWidth,
      height: globalObject.innerHeight,
    }),
  }),
  mapThrottledHandlerAnimationFrame('setDimensions'),
  onMount(({ setDimensions }) => {
    globalObject.addEventListener('resize', setDimensions)
  }),
  onUnmount(({ setDimensions }) => {
    globalObject.removeEventListener('resize', setDimensions)
  })
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
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: dimensions.width,
        _parentHeight: dimensions.height,
        _left: 0,
        _top: 0,
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

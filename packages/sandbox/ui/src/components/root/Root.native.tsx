import React from 'react'
import { Dimensions } from 'react-native'
import {
  component,
  mapState,
  onMount,
  onUnmount,
  startWithType,
  mapHandlers,
} from 'refun'
import { LayoutContext } from '../layout-context'
import { RootContext } from './RootContext'

export const Root = component(
  startWithType<{}>(),
  mapState('dimensions', 'setDimensions', () => {
    const { width, height } = Dimensions.get('window')

    return {
      width,
      height,
    }
  }, []),
  mapHandlers({
    setDimensions: ({ setDimensions }) => ({ window: { width, height } }: any) => setDimensions({
      width,
      height,
    }),
  }),
  onMount(({ setDimensions }) => {
    Dimensions.addEventListener('change', setDimensions)
  }),
  onUnmount(({ setDimensions }) => {
    Dimensions.removeEventListener('change', setDimensions)
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

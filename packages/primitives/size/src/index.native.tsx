import React, { ReactNode } from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import {
  component,
  mapDefaultProps,
  mapHandlers,
  mapState,
  startWithType,
} from 'refun'
import { TDimensions } from './types'

export type TNativeSizeProps = {
  initialWidth?: number,
  initialHeight?: number,
  children: (dimension: TDimensions) => ReactNode
}

export const Size = component(
  startWithType<TNativeSizeProps>(),
  mapDefaultProps({
    initialWidth: 0,
    initialHeight: 0,
  }),
  mapState('dimensions', 'setDimensions', ({ initialWidth, initialHeight }) => ({
    width: initialWidth,
    height: initialHeight,
    x: 0,
    y: 0,
  }), []),
  mapHandlers({
    onLayout: ({ setDimensions }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setDimensions(layout)
    },
  })
)('Size', ({ dimensions, children, onLayout }) => (
  <View onLayout={onLayout}>{children(dimensions)}</View>
))

import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction } from 'tsfn'
import { TStyle } from '@lada/prefix'
import { TSize } from './types'

const defaultStyles: TStyle = {
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto',
  alignSelf: 'flex-start',
}

export const Size = component(
  startWithType<TSize>(),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange, onChange }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const layoutWidth = Math.round(layout.width * 1000) / 1000
      const layoutHeight = Math.round(layout.height * 1000) / 1000
      const hasWidthChanged = layoutWidth !== width
      const hasHeightChanged = layoutHeight !== height

      if (hasWidthChanged && isFunction(onWidthChange)) {
        onWidthChange(layoutWidth)
      }

      if (hasHeightChanged && isFunction(onHeightChange)) {
        onHeightChange(layoutHeight)
      }

      if ((hasWidthChanged || hasHeightChanged) && isFunction(onChange)) {
        onChange({ width: layoutWidth, height: layoutHeight })
      }
    },
  })
)('Size', ({ children, onLayout }) => (
  <View style={defaultStyles} onLayout={onLayout}>{children}</View>
))

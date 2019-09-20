import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction, isUndefined } from 'tsfn'
import { normalizeStyle } from 'stili'
import { mapSizeUpdate } from './map-size-update'
import { TSize } from './types'

const style = normalizeStyle({
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'flex-start',
})

export const Size = component(
  startWithType<TSize>(),
  mapSizeUpdate(),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange, onChange, onSizeUpdate, sizeId }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
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

      if (isFunction(onSizeUpdate) && (isUndefined(width) || !hasWidthChanged) && (isUndefined(height) || !hasHeightChanged)) {
        onSizeUpdate(sizeId.current)
      }
    },
  })
)(({ children, onLayout }) => (
  <View style={style} onLayout={onLayout}>{children}</View>
))

Size.displayName = 'Size'
